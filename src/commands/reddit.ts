import { ApplyOptions } from "@sapphire/decorators";
import { type Args, Command } from "@sapphire/framework";
import type { Message } from "discord.js";
import { RedditRenderer } from "../lib/renderer";

@ApplyOptions<Command.Options>({
  description: "download media from reddit",
  aliases: ["r"],
})
export class RedditCommand extends Command {
  private readonly renderer = new RedditRenderer();

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
        viewLabel: "View on Reddit",
      });
    }

    return message.suppressEmbeds();
  }
}
