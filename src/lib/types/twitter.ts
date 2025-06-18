export interface TwitterResponse {
  data: Data;
}

export interface Data {
  __typename: string;
  lang: string;
  place: Place;
  favorite_count: number;
  possibly_sensitive: boolean;
  created_at: string;
  display_text_range: number[];
  id_str: string;
  text: string;
  user: User;
  edit_control: EditControl;
  mediaDetails: MediaDetail[];
  photos: Photo[];
  video: Video;
  conversation_count: number;
  news_action_type: string;
  isEdited: boolean;
  isStaleEdit: boolean;
}

export interface Place {
  full_name: string;
  id: string;
}

export interface Medum {
  display_url: string;
  expanded_url: string;
  indices: number[];
  url: string;
}

export interface User {
  id_str: string;
  name: string;
  profile_image_url_https: string;
  screen_name: string;
  verified: boolean;
  is_blue_verified: boolean;
  profile_image_shape: string;
}

export interface EditControl {
  edit_tweet_ids: string[];
  editable_until_msecs: string;
  is_edit_eligible: boolean;
  edits_remaining: string;
}

export interface MediaDetail {
  display_url: string;
  expanded_url: string;
  ext_media_availability: ExtMediaAvailability;
  indices: number[];
  media_url_https: string;
  original_info: OriginalInfo;
  sizes: Sizes;
  type: string;
  url: string;
  video_info?: VideoInfo;
}

export interface ExtMediaAvailability {
  status: string;
}

export interface OriginalInfo {
  height: number;
  width: number;
  focus_rects: FocusRect[];
}

export interface FocusRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Sizes {
  large: Large;
  medium: Medium;
  small: Small;
  thumb: Thumb;
}

export interface Large {
  h: number;
  resize: string;
  w: number;
}

export interface Medium {
  h: number;
  resize: string;
  w: number;
}

export interface Small {
  h: number;
  resize: string;
  w: number;
}

export interface Thumb {
  h: number;
  resize: string;
  w: number;
}

export interface VideoInfo {
  aspect_ratio: number[];
  duration_millis: number;
  variants: Variant[];
}

export interface Variant {
  content_type: string;
  url: string;
  bitrate?: number;
}

export interface Photo {
  backgroundColor: BackgroundColor;
  cropCandidates: CropCandidate[];
  expandedUrl: string;
  url: string;
  width: number;
  height: number;
}

export interface BackgroundColor {
  red: number;
  green: number;
  blue: number;
}

export interface CropCandidate {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Video {
  aspectRatio: number[];
  contentType: string;
  durationMs: number;
  mediaAvailability: MediaAvailability;
  poster: string;
  variants: Variant2[];
  videoId: VideoId;
  viewCount: number;
}

export interface MediaAvailability {
  status: string;
}

export interface Variant2 {
  type: string;
  src: string;
}

export interface VideoId {
  type: string;
  id: string;
}
