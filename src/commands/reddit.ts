import { ApplyOptions } from "@sapphire/decorators";
import { type Args, Command } from "@sapphire/framework";
import {
  ActionRowBuilder,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle,
  type Message,
} from "discord.js";
import type { PostData, RedditResponse } from "../lib/types/reddit";

interface ProcessedPost {
  id: string;
  title: string;
  author: string;
  url: string;
  subreddit: string;
  text: string;
  postHint: string;
  media: string[];
}

@ApplyOptions<Command.Options>({
  description: "download media from reddit",
})
export class RedditCommand extends Command {
  override async messageRun(message: Message, args: Args) {
    await message.suppressEmbeds();
    if (!message.channel.isSendable()) return;

    const urls = await args.repeat("string");

    if (urls.length === 0) {
      return message.channel.send("Please provide at least one URL.");
    }

    const ids = urls.map((url) => this.getIdFromRedditUrl(url)).join(",");

    const posts = await this.fetchPostData(ids);

    for (const post of posts) {
      if (!post) {
        return message.channel.send("Failed to extract data from the URL.");
      }

      const content = `<:reddit:1383775466963603568> \`r/${post.subreddit}\` **@${post.author}**`;
      const button = new ButtonBuilder()
        .setLabel("View on Reddit")
        .setStyle(ButtonStyle.Link)
        .setURL(post.url);
      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

      if (post.postHint === "rich:video" || post.postHint === "link") {
        return message.channel.send({
          content: `${content}\n${post.media.join("\n")}`,
          components: [row],
        });
      }

      if (post.media.length === 0) {
        return message.channel.send({
          content: `${content}\nNo media found.`,
          components: [row],
        });
      }

      const MAX_SIZE_MB = 10;
      const FILE_LIMIT = 10;

      const files: AttachmentBuilder[] = [];
      const tooBigFiles: string[] = [];

      for (const mediaUrl of post.media) {
        const mediaBuffer = await this.getBufferFromUrl(mediaUrl);
        const mediaFileSizeMB = mediaBuffer.byteLength / (1024 * 1024);

        if (mediaFileSizeMB > MAX_SIZE_MB) {
          tooBigFiles.push(mediaUrl);
          continue;
        }

        files.push(
          new AttachmentBuilder(mediaBuffer, {
            name: mediaUrl.split("/").pop(),
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

    return;
  }

  private async getBufferFromUrl(url: string): Promise<Buffer> {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();

    return Buffer.from(arrayBuffer);
  }

  private getIdFromRedditUrl(url: string): string {
    const { pathname } = new URL(url.trim());

    const match = pathname.match(/\/comments\/([0-9a-z]+)(?:[/?]|$)/i);
    if (match) return match[1];

    return "";
  }

  private async fetchReddit(ids: string) {
    const response = await fetch(`
    https://arctic-shift.photon-reddit.com/api/posts/ids?ids=${ids}`);
    const data = await response.json();

    return data as RedditResponse;
  }

  private async fetchPostData(ids: string): Promise<ProcessedPost[]> {
    const posts = await this.fetchReddit(ids);
    return posts.data.map((post) => this.processPostData(post));
  }

  private processPostData(post: PostData): ProcessedPost {
    let media: string[] = [];

    switch (post.post_hint) {
      case "image":
      case "link":
      case "rich:video":
        media = [post.url];
        break;
      case "hosted:video":
        media = [post.secure_media.reddit_video.fallback_url.split("?")[0]];
        break;
      default:
        if (post.is_gallery && post.media_metadata) {
          media = Object.keys(post.media_metadata).map(
            (mediaItem) => `https://i.redd.it/${mediaItem}.jpg`,
          );
        }
        break;
    }
    return {
      id: post.id,
      title: post.title,
      author: post.author,
      url: `https://reddit.com${post.permalink}`,
      subreddit: post.subreddit,
      text: post.selftext,
      postHint: post.post_hint ?? "",
      media,
    };
  }
}
