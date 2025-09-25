// Content Store Utilities for Integration & Automation Hub

import type { ContentItem, IntegrationConfig, ExportConfig, ImportResult } from '../../types/integration';

// Simple in-memory storage (in production, this would be replaced with a database)
class ContentStore {
  private content: ContentItem[] = [];
  private integrations: IntegrationConfig[] = [];

  // Content Management
  async saveContent(item: ContentItem): Promise<void> {
    const existingIndex = this.content.findIndex(c => c.id === item.id);
    if (existingIndex >= 0) {
      this.content[existingIndex] = item;
    } else {
      this.content.push(item);
    }
  }

  async getContent(id: string): Promise<ContentItem | null> {
    return this.content.find(c => c.id === id) || null;
  }

  async getAllContent(): Promise<ContentItem[]> {
    return [...this.content];
  }

  async getContentBySource(sourceType: ContentItem['importSource']['type']): Promise<ContentItem[]> {
    return this.content.filter(c => c.importSource?.type === sourceType);
  }

  async deleteContent(id: string): Promise<boolean> {
    const index = this.content.findIndex(c => c.id === id);
    if (index >= 0) {
      this.content.splice(index, 1);
      return true;
    }
    return false;
  }

  async findDuplicateContent(item: Partial<ContentItem>): Promise<ContentItem | null> {
    // Check for duplicates based on URL, title, or original ID
    return this.content.find(c => 
      (item.url && c.url === item.url) ||
      (item.importSource?.originalId && c.importSource?.originalId === item.importSource.originalId) ||
      (item.title && c.title === item.title && Math.abs(new Date(c.publishedAt).getTime() - new Date(item.publishedAt || '').getTime()) < 24 * 60 * 60 * 1000)
    ) || null;
  }

  // Integration Configuration Management
  async saveIntegration(config: IntegrationConfig): Promise<void> {
    const existingIndex = this.integrations.findIndex(i => i.platform === config.platform);
    if (existingIndex >= 0) {
      this.integrations[existingIndex] = { ...config, updatedAt: new Date().toISOString() };
    } else {
      this.integrations.push({
        ...config,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
  }

  async getIntegration(platform: string): Promise<IntegrationConfig | null> {
    return this.integrations.find(i => i.platform === platform) || null;
  }

  async getAllIntegrations(): Promise<IntegrationConfig[]> {
    return [...this.integrations];
  }

  async deleteIntegration(platform: string): Promise<boolean> {
    const index = this.integrations.findIndex(i => i.platform === platform);
    if (index >= 0) {
      this.integrations.splice(index, 1);
      return true;
    }
    return false;
  }

  // Bulk Import
  async importBulkContent(items: Partial<ContentItem>[]): Promise<ImportResult> {
    const result: ImportResult = {
      success: true,
      itemsProcessed: items.length,
      itemsImported: 0,
      duplicatesSkipped: 0,
      errors: [],
      summary: ''
    };

    for (const item of items) {
      try {
        // Validate required fields
        if (!item.title || !item.content || !item.publishedAt) {
          result.errors.push({
            item,
            error: 'Missing required fields: title, content, or publishedAt'
          });
          continue;
        }

        // Check for duplicates
        const duplicate = await this.findDuplicateContent(item);
        if (duplicate) {
          result.duplicatesSkipped++;
          continue;
        }

        // Create full ContentItem with defaults
        const fullItem: ContentItem = {
          id: item.id || this.generateId(),
          title: item.title,
          description: item.description || '',
          content: item.content,
          type: item.type || 'article',
          url: item.url,
          publishedAt: item.publishedAt,
          tags: item.tags || [],
          importSource: item.importSource || {
            type: 'manual',
            importedAt: new Date().toISOString()
          },
          exportHistory: [],
          metadata: item.metadata || {}
        };

        await this.saveContent(fullItem);
        result.itemsImported++;
      } catch (error) {
        result.errors.push({
          item,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    if (result.errors.length > 0) {
      result.success = false;
    }

    result.summary = `Processed ${result.itemsProcessed} items: ${result.itemsImported} imported, ${result.duplicatesSkipped} duplicates skipped, ${result.errors.length} errors`;

    return result;
  }

  // Utility methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Export helpers
  async filterContent(filters?: ExportConfig['filters']): Promise<ContentItem[]> {
    let filtered = [...this.content];

    if (filters?.dateRange) {
      const start = new Date(filters.dateRange.start);
      const end = new Date(filters.dateRange.end);
      filtered = filtered.filter(item => {
        const date = new Date(item.publishedAt);
        return date >= start && date <= end;
      });
    }

    if (filters?.contentTypes?.length) {
      filtered = filtered.filter(item => filters.contentTypes!.includes(item.type));
    }

    if (filters?.tags?.length) {
      filtered = filtered.filter(item => 
        filters.tags!.some(tag => item.tags.includes(tag))
      );
    }

    return filtered;
  }
}

// Singleton instance
export const contentStore = new ContentStore();