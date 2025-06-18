import { ApplyOptions } from "@sapphire/decorators";
import { type Args, Command } from "@sapphire/framework";
import {
  ActionRowBuilder,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle,
  type Message,
} from "discord.js";
import type { TwitterResponse } from "../lib/types/twitter";

@ApplyOptions<Command.Options>({
  description: "download media from twitter",
})
export class UserCommand extends Command {
  public override async messageRun(message: Message, args: Args) {
    if (!message.channel.isSendable()) return;

    const urls = await args.repeat("string");

    if (urls.length === 0) {
      return message.channel.send("Please provide at least one URL.");
    }

    for (const url of urls) {
      const tweet = await this.fetchTweet(this.extractTweetId(url));

      const now = new Date();
      const yymmdd = now.toISOString().slice(2, 10).replace(/-/g, "");
      const content = `<:twitter:1382950305473364058> \`${yymmdd}\` **${tweet.data.user.name} (@${tweet.data.user.screen_name})**`;
      const button = new ButtonBuilder()
        .setLabel("View on X")
        .setStyle(ButtonStyle.Link)
        .setURL(url);
      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

      const MAX_SIZE_MB = 10;
      const FILE_LIMIT = 10;

      const files: AttachmentBuilder[] = [];
      const tooBigFiles: string[] = [];

      for (const media of tweet.data.mediaDetails) {
        let mediaUrl = "";
        if (media.type === "photo") {
          mediaUrl = `${media.media_url_https}?name=4096x4096`;
        } else {
          mediaUrl =
            media.video_info?.variants[media.video_info?.variants.length - 1]
              .url ?? "";
        }

        const mediaBuffer = await this.getBufferFromUrl(mediaUrl);
        const mediaFileSizeMB = mediaBuffer.byteLength / (1024 * 1024);

        if (mediaFileSizeMB > MAX_SIZE_MB) {
          tooBigFiles.push(mediaUrl);
          continue;
        }

        files.push(
          new AttachmentBuilder(mediaBuffer, {
            name: mediaUrl.split("?")[0].split("/").pop(),
          }),
        );
      }

      await message.channel.send({
        content: `${content}\n${tooBigFiles.join("\n")}`,
        files: files.slice(0, FILE_LIMIT),
        components: [row],
      });

      for (let i = FILE_LIMIT; i < files.length; i += FILE_LIMIT) {
        await message.channel.send({
          files: files.slice(i, i + FILE_LIMIT),
          components: [row],
        });
      }
    }

    return message.suppressEmbeds();
  }

  private async getBufferFromUrl(url: string): Promise<Buffer> {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();

    return Buffer.from(arrayBuffer);
  }

  private extractTweetId(url: string) {
    return url.split("/").pop() ?? "";
  }

  private async fetchTweet(id: string) {
    const response = await fetch(
      `https://react-tweet-next.vercel.app/api/tweet/${id}`,
    );
    const data = await response.json();

    return data as TwitterResponse;
  }
}
