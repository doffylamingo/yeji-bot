import { ApplyOptions } from "@sapphire/decorators";
import { Command } from "@sapphire/framework";
import { Message } from "discord.js";

@ApplyOptions<Command.Options>({
  description: "ping pong",
})
export class PingCommand extends Command {
  public override async messageRun(message: Message) {
    const ping = Date.now() - message.createdTimestamp;
    return message.reply({
      content: `Pong! Latency is ${ping}ms.`,
    });
  }
}
