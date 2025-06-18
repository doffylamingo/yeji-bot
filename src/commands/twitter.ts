import { ApplyOptions } from "@sapphire/decorators";
import { type Args, Command } from "@sapphire/framework";
import type { Message } from "discord.js";
import { TwitterRenderer } from "../lib/renderer";

@ApplyOptions<Command.Options>({
  description: "download media from twitter",
  aliases: ["x", "t"],
})
export class TwitterCommand extends Command {
  private readonly renderer = new TwitterRenderer();

  public override async messageRun(message: Message, args: Args) {
    if (!message.channel.isSendable()) return;

    const urls = await args.repeat("string");
    if (!urls.length) return message.channel.send("Please provide a URL.");

    for (const url of urls) {
      const { content, files } = await this.renderer.getPost(url);

      await this.renderer.send({
        message,
        content,
        files,
        viewUrl: url,
        viewLabel: "View on X",
      });
    }

    return message.suppressEmbeds();
  }
}
