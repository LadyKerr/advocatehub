// RSS Feed Parser for Integration & Automation Hub

import Parser from 'rss-parser';
import type { ContentItem, RSSFeedConfig, ImportResult } from '../../types/integration';
import { contentStore } from './contentStore';

interface RSSItem {
  title?: string;
  link?: string;
  pubDate?: string;
  creator?: string;
  content?: string;
  contentSnippet?: string;
  guid?: string;
  categories?: string[];
  [key: string]: any;
}

interface RSSFeed {
  title?: string;
  description?: string;
  link?: string;
  items: RSSItem[];
}

export class RSSFeedParser {
  private parser: Parser<RSSFeed, RSSItem>;

  constructor() {
    this.parser = new Parser({
      customFields: {
        feed: ['language', 'copyright', 'managingEditor', 'webMaster'],
        item: ['creator', 'content:encoded', 'category', 'guid']
      }
    });
  }

  async validateFeedUrl(url: string): Promise<{ valid: boolean; error?: string; feedInfo?: { title: string; description: string; itemCount: number } }> {
    try {
      // Basic URL validation
      new URL(url);
      
      // Try to parse the feed
      const feed = await this.parser.parseURL(url);
      
      return {
        valid: true,
        feedInfo: {
          title: feed.title || 'Unknown Feed',
          description: feed.description || '',
          itemCount: feed.items.length
        }
      };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'Failed to validate RSS feed'
      };
    }
  }

  async parseFeed(url: string): Promise<{ success: boolean; items: Partial<ContentItem>[]; error?: string }> {
    try {
      const feed = await this.parser.parseURL(url);
      
      const items: Partial<ContentItem>[] = feed.items.map(item => {
        const contentType = this.detectContentType(item);
        
        return {
          title: item.title || 'Untitled',
          description: item.contentSnippet || item.content?.substring(0, 200) || '',
          content: item.content || item.contentSnippet || '',
          type: contentType,
          url: item.link,
          publishedAt: item.pubDate || new Date().toISOString(),
          tags: item.categories || [],
          importSource: {
            type: 'rss',
            sourceUrl: url,
            importedAt: new Date().toISOString(),
            originalId: item.guid || item.link
          },
          metadata: {
            creator: item.creator,
            guid: item.guid,
            feedTitle: feed.title,
            feedDescription: feed.description
          }
        };
      });

      return { success: true, items };
    } catch (error) {
      return {
        success: false,
        items: [],
        error: error instanceof Error ? error.message : 'Failed to parse RSS feed'
      };
    }
  }

  async importFromRSSFeed(config: RSSFeedConfig): Promise<ImportResult> {
    try {
      // Parse the RSS feed
      const parseResult = await this.parseFeed(config.config.feedUrl);
      
      if (!parseResult.success) {
        return {
          success: false,
          itemsProcessed: 0,
          itemsImported: 0,
          duplicatesSkipped: 0,
          errors: [{ error: parseResult.error || 'Failed to parse RSS feed' }],
          summary: 'Failed to parse RSS feed'
        };
      }

      // Filter items based on last check if configured
      let itemsToImport = parseResult.items;
      if (config.config.lastCheck) {
        const lastCheckDate = new Date(config.config.lastCheck);
        itemsToImport = parseResult.items.filter(item => 
          new Date(item.publishedAt || '') > lastCheckDate
        );
      }

      // Apply content type mapping if configured
      if (config.config.contentTypeMapping) {
        itemsToImport = itemsToImport.map(item => ({
          ...item,
          type: config.config.contentTypeMapping?.[item.type || 'article'] || item.type
        }));
      }

      // Import items using content store
      const importResult = await contentStore.importBulkContent(itemsToImport);

      // Update last check time
      config.config.lastCheck = new Date().toISOString();
      await contentStore.saveIntegration(config);

      return importResult;
    } catch (error) {
      return {
        success: false,
        itemsProcessed: 0,
        itemsImported: 0,
        duplicatesSkipped: 0,
        errors: [{ error: error instanceof Error ? error.message : 'Unknown error occurred' }],
        summary: 'Import failed due to unexpected error'
      };
    }
  }

  private isVideoUrl(url?: string): boolean {
    if (!url) return false;
    
    try {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname.toLowerCase();
      
      // Check for exact domain matches or proper subdomains
      return hostname === 'youtube.com' || 
             hostname === 'www.youtube.com' || 
             hostname === 'youtu.be' ||
             hostname === 'vimeo.com' || 
             hostname === 'www.vimeo.com' ||
             hostname.endsWith('.youtube.com') ||
             hostname.endsWith('.vimeo.com');
    } catch {
      return false;
    }
  }

  private detectContentType(item: RSSItem): ContentItem['type'] {
    const title = (item.title || '').toLowerCase();
    const categories = (item.categories || []).map(cat => cat.toLowerCase());
    
    // Check for video indicators
    if (categories.some(cat => cat.includes('video')) || 
        title.includes('video') || 
        this.isVideoUrl(item.link)) {
      return 'video';
    }
    
    // Check for podcast indicators
    if (categories.some(cat => cat.includes('podcast')) || 
        title.includes('podcast') || 
        title.includes('episode')) {
      return 'podcast';
    }
    
    // Check for release indicators
    if (categories.some(cat => cat.includes('release')) || 
        title.includes('release') || 
        title.includes('version') ||
        title.includes('update')) {
      return 'release';
    }
    
    // Check for social post indicators (short content)
    if ((item.content || item.contentSnippet || '').length < 300) {
      return 'social-post';
    }
    
    // Check for blog post indicators
    if (categories.some(cat => cat.includes('blog')) || 
        title.includes('blog')) {
      return 'blog-post';
    }
    
    // Default to article
    return 'article';
  }

  async scheduleCheck(config: RSSFeedConfig): Promise<void> {
    // In a real implementation, this would set up a scheduled job
    // For now, we'll just update the configuration
    console.log(`Scheduled RSS check for ${config.config.feedUrl} every ${config.config.checkInterval} minutes`);
  }
}

export const rssParser = new RSSFeedParser();