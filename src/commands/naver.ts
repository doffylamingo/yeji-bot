import { ApplyOptions } from "@sapphire/decorators";
import { type Args, Command } from "@sapphire/framework";
import type { Message } from "discord.js";
import { NaverRenderer } from "../lib/renderer";

@ApplyOptions<Command.Options>({
  description: "download media from naver articles",
  aliases: ["n", "news"],
})
export class NaverCommand extends Command {
  private readonly renderer = new NaverRenderer();

  public override async messageRun(message: Message, args: Args) {
    if (!message.channel.isSendable()) return;

    const urls = await args.repeat("string");

    if (urls.length === 0)
      return message.channel.send("Please provide at least one URL.");

    for (const url of urls) {
      const { content, files } = await this.renderer.getPost(url);
      if (files.length === 0) {
        await message.channel.send(`No media found: <${url}>`);
        continue;
      }

      await this.renderer.send({
        message,
        content,
        files,
        viewUrl: url,
        viewLabel: "View on Naver",
      });
    }

    return message.suppressEmbeds();
  }
}
