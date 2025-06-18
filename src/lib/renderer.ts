import { Buffer } from "node:buffer";
import {
  ActionRowBuilder,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle,
  type Message,
} from "discord.js";
import parse from "node-html-parser";
import type { RedditResponse } from "./types/reddit";
import type { TwitterResponse } from "./types/twitter";

export class MediaRenderer {
  protected readonly MAX_SIZE_MB = 10;
  protected readonly FILE_LIMIT = 10;

  public async send(opts: {
    message: Message;
    content: string;
    files: AttachmentBuilder[];
    viewUrl: string;
    viewLabel: string;
  }) {
    const { message, content, files, viewUrl, viewLabel } = opts;
    if (!message.channel.isSendable()) return;

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setLabel(viewLabel)
        .setStyle(ButtonStyle.Link)
        .setURL(viewUrl),
    );

    await message.channel.send({
      content: content,
      files: files.slice(0, this.FILE_LIMIT),
      components: [row],
    });

    for (let i = this.FILE_LIMIT; i < files.length; i += this.FILE_LIMIT) {
      await message.channel.send({
        files: files.slice(i, i + this.FILE_LIMIT),
        components: [row],
      });
    }
  }

  protected async buildAttachments(files: string[]) {
    const attachments: AttachmentBuilder[] = [];
    const tooBigFiles: string[] = [];

    for (const file of files) {
      const res = await fetch(file);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.byteLength / 1024 / 1024 > this.MAX_SIZE_MB) {
        tooBigFiles.push(file);
        continue;
      }
      attachments.push(
        new AttachmentBuilder(buf, {
          name: file.split("?")[0].split("/").pop(),
        }),
      );
    }

    return {
      attachments,
      tooBigFiles,
    };
  }
}

export class NaverRenderer extends MediaRenderer {
  async getPost(url: string) {
    const res = await fetch(url);
    const html = await res.text();
    const root = parse(html);

    const title =
      root
        .querySelector(".ArticleHead_article_title__qh8GV")
        ?.textContent?.trim() || "";

    const images = root
      .querySelectorAll("#comp_news_article img")
      .map(img => img.getAttribute("src")?.split("?")[0] || "");

    const date = root.querySelector("em.date")?.textContent?.trim() || "";

    const [year, month, day] = date.split(" ")[0].split(".");

    const yymmdd = year.slice(2) + month + day;

    const { attachments, tooBigFiles } = await this.buildAttachments(images);

    return {
      content: `\`${yymmdd}\` **${title}**\n${tooBigFiles.join("\n")}`,
      files: attachments,
    };
  }
}

export class RedditRenderer extends MediaRenderer {
  private extractId(url: string): string {
    const match = new URL(url).pathname.match(
      /\/comments\/([0-9a-z]+)(?:[/?]|$)/i,
    );
    return match?.[1] ?? "";
  }

  async getPost(url: string) {
    const id = this.extractId(url);

    const response = await fetch(`
    https://arctic-shift.photon-reddit.com/api/posts/ids?ids=${id}`);
    const { data } = (await response.json()) as RedditResponse;

    const post = data[0];

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
            mediaItem => `https://i.redd.it/${mediaItem}.jpg`,
          );
        }
        break;
    }

    const { attachments, tooBigFiles } = await this.buildAttachments(media);

    const timestamp = post.created_utc;
    const date = new Date(timestamp * 1000);
    const yymmdd = date.toISOString().slice(2, 10).replace(/-/g, "");

    const content = `<:reddit:1383775466963603568> \`${yymmdd}\` \`r/${post.subreddit}\` **@${post.author}**`;

    if (post.post_hint === "rich:video" || post.post_hint === "link") {
      return {
        content: `${content}\n${post.media.join("\n")}`,
        files: [],
      };
    }

    return {
      content: `${content}\n${tooBigFiles.join("\n")}`,
      files: attachments,
    };
  }
}

export class TwitterRenderer extends MediaRenderer {
  private extractId(url: string) {
    return url.split("/").pop() ?? "";
  }

  async getPost(url: string) {
    const id = this.extractId(url);
    const response = await fetch(
      `https://react-tweet-next.vercel.app/api/tweet/${id}`,
    );
    const { data } = (await response.json()) as TwitterResponse;

    const now = new Date(data.created_at);
    const yymmdd = now.toISOString().slice(2, 10).replace(/-/g, "");
    const content = `<:twitter:1382950305473364058> \`${yymmdd}\` **${data.user.name} (@${data.user.screen_name})**`;

    if (!("mediaDetails" in data))
      return {
        content: `${content}\nNo media found.`,
        files: [],
      };

    const { attachments, tooBigFiles } = await this.buildAttachments(
      data.mediaDetails.map(m => {
        const isPhoto = m.type === "photo";
        return isPhoto
          ? `${m.media_url_https}?name=4096x4096`
          : (m.video_info?.variants.at(-1)?.url ?? "");
      }),
    );

    return {
      content: `${content}\n${tooBigFiles.join("\n")}`,
      files: attachments,
    };
  }
}
