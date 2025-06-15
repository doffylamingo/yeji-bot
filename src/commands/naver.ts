import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command } from "@sapphire/framework";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageFlags,
  type Message,
} from "discord.js";
import parse from "node-html-parser";

@ApplyOptions<Command.Options>({
  description: "download media from naver articles",
})
export class NaverCommand extends Command {
  public override async messageRun(message: Message, args: Args) {
    await message.suppressEmbeds();
    if (!message.channel.isSendable()) return;

    const urls = await args.repeat("string");

    if (urls.length === 0) {
      return message.channel.send("Please provide at least one URL.");
    }

    for (const url of urls) {
      if (!this.isValidNaverArticleUrl(url)) {
        await message.channel.send({
          content: `:x: Invalid URL: ${url}.\nPlease provide a valid Naver article URL.\n> Example: https://m.entertain.naver.com/home/article/022/0004042023`,
          flags: MessageFlags.SuppressEmbeds,
        });

        continue;
      }

      const { title, images, date } = await this.naverExtractor(url);

      if (!title) {
        await message.channel.send(
          `:x: Failed to extract data from URL: <${url}>`,
        );
        continue;
      }

      if (images.length === 0) {
        await message.channel.send(`:x: No images found: <${url}>`);
        continue;
      }

      const IMAGE_LIMIT = 10;

      const button = new ButtonBuilder()
        .setLabel("View on Naver")
        .setStyle(ButtonStyle.Link)
        .setURL(url);
      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

      await message.channel.send({
        content: `\`${date}\` **${title}**`,
        files: images.slice(0, IMAGE_LIMIT),
        components: [row],
      });

      for (let i = IMAGE_LIMIT; i < images.length; i += IMAGE_LIMIT) {
        await message.channel.send({
          files: images.slice(i, i + IMAGE_LIMIT),
          components: [row],
        });
      }
    }

    return;
  }

  private isValidNaverArticleUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return (
        urlObj.hostname === "m.entertain.naver.com" &&
        urlObj.pathname.startsWith("/home/article")
      );
    } catch {
      return false;
    }
  }

  private async naverExtractor(url: string): Promise<{
    title: string;
    images: string[];
    date: string;
  }> {
    const res = await fetch(url);
    const html = await res.text();
    const root = parse(html);

    const title =
      root
        .querySelector(".ArticleHead_article_title__qh8GV")
        ?.textContent?.trim() || "";

    const images = root
      .querySelectorAll("#comp_news_article img")
      .map((img) => img.getAttribute("src")?.split("?")[0] || "");

    const date = root.querySelector("em.date")?.textContent?.trim() || "";

    const [year, month, day] = date?.split(" ")[0].split(".");

    const yymmdd = year.slice(2) + month + day;

    return {
      title,
      images,
      date: yymmdd,
    };
  }
}
