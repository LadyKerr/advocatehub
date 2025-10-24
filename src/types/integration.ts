// Integration & Automation Hub Type Definitions

export interface ContentItem {
  id: string;
  title: string;
  description?: string;
  content: string;
  type: 'blog-post' | 'video' | 'podcast' | 'social-post' | 'release' | 'article';
  url?: string;
  publishedAt: string;
  tags: string[];
  importSource?: {
    type: 'rss' | 'webhook' | 'manual';
    sourceUrl?: string;
    importedAt: string;
    originalId?: string;
  };
  exportHistory?: Array<{
    format: 'csv' | 'json' | 'pdf';
    exportedAt: string;
    recipient?: string;
    downloadUrl?: string;
  }>;
  metadata?: Record<string, any>;
}

export interface IntegrationConfig {
  platform: string;
  enabled: boolean;
  config: Record<string, any>;
  lastSync?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RSSFeedConfig extends IntegrationConfig {
  platform: 'rss';
  config: {
    feedUrl: string;
    feedTitle: string;
    checkInterval: number; // minutes
    lastCheck?: string;
    autoImport: boolean;
    contentTypeMapping?: Record<string, ContentItem['type']>;
  };
}

export interface WebhookConfig extends IntegrationConfig {
  platform: 'github' | 'youtube' | 'blog' | 'social';
  config: {
    webhookUrl: string;
    secret?: string;
    events: string[];
    headers?: Record<string, string>;
    active: boolean;
  };
}

export interface ExportConfig {
  format: 'csv' | 'json' | 'pdf';
  filename: string;
  filters?: {
    dateRange?: {
      start: string;
      end: string;
    };
    contentTypes?: ContentItem['type'][];
    tags?: string[];
  };
  options?: {
    includeMetadata?: boolean;
    includeContent?: boolean;
    pdfTemplate?: 'portfolio' | 'report' | 'summary';
  };
}

export interface ImportResult {
  success: boolean;
  itemsProcessed: number;
  itemsImported: number;
  duplicatesSkipped: number;
  errors: Array<{
    item?: Partial<ContentItem>;
    error: string;
  }>;
  summary: string;
}

export interface WebhookPayload {
  source: string;
  event: string;
  timestamp: string;
  data: Record<string, any>;
  signature?: string;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}