/** biome-ignore-all lint/suspicious/noExplicitAny: i aint typing all that */
export interface RedditResponse {
  data: PostData[];
}

export interface ListingData {
  after: string | null;
  dist: number | null;
  modhash: string;
  geo_filter: string;
  children: RedditChild[];
  before: string | null;
}

export interface RedditChild {
  kind: "t3" | "t1";
  data: PostData | CommentData;
}

export interface PostData {
  approved_at_utc: number | null;
  subreddit: string;
  selftext: string;
  user_reports: any[];
  saved: boolean;
  mod_reason_title: string | null;
  gilded: number;
  clicked: boolean;
  is_gallery?: boolean;
  post_hint?:
    | "image"
    | "rich:video"
    | "hosted:video"
    | "self"
    | "link"
    | "gallery";
  title: string;
  link_flair_richtext: any[];
  subreddit_name_prefixed: string;
  hidden: boolean;
  pwls: number;
  link_flair_css_class: string | null;
  downs: number;
  thumbnail_height: number | null;
  top_awarded_type: string | null;
  name: string;
  media_metadata?: MediaMetadata;
  preview?: Preview;
  hide_score: boolean;
  quarantine: boolean;
  link_flair_text_color: string | null;
  upvote_ratio: number;
  author_flair_background_color: string | null;
  ups: number;
  domain: string;
  media_embed: MediaEmbed;
  thumbnail_width: number | null;
  author_flair_template_id: string | null;
  is_original_content: boolean;
  author_fullname: string;
  secure_media: any | null;
  is_reddit_media_domain: boolean;
  is_meta: boolean;
  category: string | null;
  secure_media_embed: MediaEmbed;
  gallery_data?: GalleryData;
  link_flair_text: string | null;
  can_mod_post: boolean;
  score: number;
  approved_by: string | null;
  is_created_from_ads_ui: boolean;
  author_premium: boolean;
  thumbnail: string;
  edited: boolean | number;
  author_flair_css_class: string | null;
  author_flair_richtext: any[];
  gildings: Gildings;
  content_categories: string[] | null;
  is_self: boolean;
  subreddit_type: string;
  created: number;
  link_flair_type: string;
  wls: number;
  removed_by_category: string | null;
  banned_by: string | null;
  author_flair_type: string;
  total_awards_received: number;
  allow_live_comments: boolean;
  selftext_html: string | null;
  likes: boolean | null;
  suggested_sort: string | null;
  banned_at_utc: number | null;
  url_overridden_by_dest?: string;
  view_count: number | null;
  archived: boolean;
  no_follow: boolean;
  is_crosspostable: boolean;
  pinned: boolean;
  over_18: boolean;
  all_awardings: Award[];
  awarders: any[];
  media_only: boolean;
  can_gild: boolean;
  spoiler: boolean;
  locked: boolean;
  author_flair_text: string | null;
  treatment_tags: string[];
  visited: boolean;
  removed_by: string | null;
  mod_note: string | null;
  distinguished: string | null;
  subreddit_id: string;
  author_is_blocked: boolean;
  mod_reason_by: string | null;
  num_reports: number | null;
  removal_reason: string | null;
  link_flair_background_color: string | null;
  id: string;
  is_robot_indexable: boolean;
  num_duplicates: number;
  report_reasons: any[] | null;
  author: string;
  discussion_type: string | null;
  num_comments: number;
  send_replies: boolean;
  media: any | null;
  contest_mode: boolean;
  author_patreon_flair: boolean;
  author_flair_text_color: string | null;
  permalink: string;
  stickied: boolean;
  url: string;
  subreddit_subscribers: number;
  created_utc: number;
  num_crossposts: number;
  mod_reports: any[];
  is_video: boolean;
}

export interface CommentData {
  subreddit_id: string;
  approved_at_utc: number | null;
  author_is_blocked: boolean;
  comment_type: string | null;
  awarders: any[];
  mod_reason_by: string | null;
  banned_by: string | null;
  author_flair_type: string;
  total_awards_received: number;
  subreddit: string;
  author_flair_template_id: string | null;
  likes: boolean | null;
  replies: string | CommentListing;
  user_reports: any[];
  saved: boolean;
  id: string;
  banned_at_utc: number | null;
  mod_reason_title: string | null;
  gilded: number;
  archived: boolean;
  collapsed_reason_code: string | null;
  no_follow: boolean;
  author: string;
  can_mod_post: boolean;
  created_utc: number;
  send_replies: boolean;
  parent_id: string;
  score: number;
  author_fullname: string;
  approved_by: string | null;
  mod_note: string | null;
  all_awardings: Award[];
  collapsed: boolean;
  body: string;
  edited: boolean | number;
  top_awarded_type: string | null;
  author_flair_css_class: string | null;
  name: string;
  is_submitter: boolean;
  downs: number;
  author_flair_richtext: any[];
  author_patreon_flair: boolean;
  body_html: string;
  removal_reason: string | null;
  collapsed_reason: string | null;
  distinguished: string | null;
  associated_award: string | null;
  stickied: boolean;
  author_premium: boolean;
  can_gild: boolean;
  gildings: Gildings;
  unrepliable_reason: string | null;
  author_flair_text_color: string | null;
  score_hidden: boolean;
  permalink: string;
  subreddit_type: string;
  locked: boolean;
  report_reasons: any[] | null;
  created: number;
  author_flair_text: string | null;
  treatment_tags: string[];
  link_id: string;
  subreddit_name_prefixed: string;
  controversiality: number;
  depth: number;
  author_flair_background_color: string | null;
  collapsed_because_crowd_control: boolean | null;
  mod_reports: any[];
  num_reports: number | null;
  ups: number;
}

export interface MediaMetadata {
  [key: string]: MediaItem;
}

export interface MediaItem {
  status: string;
  e: string;
  m: string;
  p: MediaPreview[];
  s: MediaSource;
  id: string;
}

export interface MediaPreview {
  y: number;
  x: number;
  u: string;
}

export interface MediaSource {
  y: number;
  x: number;
  u: string;
}

export interface GalleryData {
  items: GalleryItem[];
}

export interface GalleryItem {
  media_id: string;
  id: number;
}

export interface MediaEmbed {
  [key: string]: any;
}

export interface Gildings {
  [key: string]: number;
}

export interface Award {
  [key: string]: any;
}

export interface CommentListing {
  kind: "Listing";
  data: ListingData;
}

interface Preview {
  images: PreviewImage[];
  reddit_video_preview?: RedditVideoPreview;
  enabled: boolean;
}

interface PreviewImage {
  source: ImageSource;
  resolutions: ImageSource[];
  variants?: ImageVariants;
  id: string;
}

interface ImageSource {
  url: string;
  width: number;
  height: number;
}

interface ImageVariants {
  [key: string]: {
    source: ImageSource;
    resolutions: ImageSource[];
  };
}

interface RedditVideoPreview {
  bitrate_kbps: number;
  fallback_url: string;
  height: number;
  width: number;
  scrubber_media_url: string;
  dash_url: string;
  duration: number;
  hls_url: string;
  is_gif: boolean;
  transcoding_status: string;
}
