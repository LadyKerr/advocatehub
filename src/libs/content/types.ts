export type ContentType = 'blog' | 'video' | 'social' | 'workshop' | 'demo' | 'other';

export interface ContentItem {
  id: string;
  url: string;
  type: ContentType;
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  platform: string;
  dateAdded: string; // ISO
  tags?: string[];
  unfurlStatus: 'pending' | 'ok' | 'error';
  errorReason?: string;
  sourceMeta?: { og?: Record<string, string> };
}

export interface StoreSnapshotPayload {
  version: number;
  items: ContentItem[];
}

export interface PlatformDetection {
  platform: string;
  suggestedType: ContentType;
}
