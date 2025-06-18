import { ApplyOptions } from "@sapphire/decorators";
import { Command } from "@sapphire/framework";
import type { ChatInputCommandInteraction, Message } from "discord.js";

@ApplyOptions<Command.Options>({
  description: "ping pong",
})
export class PingCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(builder =>
      builder.setName(this.name).setDescription(this.description),
    );
  }

  public override async chatInputRun(interaction: ChatInputCommandInteraction) {
    const ping = Date.now() - interaction.createdTimestamp;
    return interaction.reply({
      content: `Pong!!! Latency is ${ping}ms.`,
    });
  }

  public override async messageRun(message: Message) {
    const ping = Date.now() - message.createdTimestamp;
    return message.reply({
      content: `Pong! Latency is ${ping}ms.`,
    });
  }
}
