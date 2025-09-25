import type { ContentItem } from './types';

/**
 * Normalize a string for searching by removing accents, converting to lowercase,
 * and removing extra whitespace
 */
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Check if a search term matches within a target string
 * Supports partial matching and word boundary matching
 */
function matchesSearchTerm(target: string, searchTerm: string): boolean {
  const normalizedTarget = normalizeString(target);
  const normalizedSearch = normalizeString(searchTerm);
  
  // Direct substring match
  if (normalizedTarget.includes(normalizedSearch)) {
    return true;
  }
  
  // Word boundary matching - check if search term matches start of any word
  const words = normalizedTarget.split(/\s+/);
  return words.some(word => word.startsWith(normalizedSearch));
}

/**
 * Get content type display name for searching
 */
function getContentTypeDisplayName(type: ContentItem['type']): string {
  const typeMap: Record<ContentItem['type'], string[]> = {
    blog: ['blog', 'article', 'post', 'writing'],
    video: ['video', 'youtube', 'recording'],
    social: ['social', 'tweet', 'linkedin', 'post'],
    workshop: ['workshop', 'training', 'tutorial'],
    demo: ['demo', 'example', 'showcase'],
    podcast: ['podcast', 'audio', 'episode'],
    livestream: ['livestream', 'stream', 'live'],
    webinar: ['webinar', 'presentation', 'talk'],
    newsletter: ['newsletter', 'email', 'publication'],
    speaking: ['speaking', 'conference', 'talk', 'presentation'],
    other: ['other', 'misc', 'miscellaneous']
  };
  
  return typeMap[type]?.join(' ') || type;
}

/**
 * Search content items based on query string
 * Searches across: title, description, tags, platform, content type
 */
export function searchContentItems(items: ContentItem[], query: string): ContentItem[] {
  if (!query.trim()) {
    return items;
  }
  
  const searchTerms = query.trim().split(/\s+/).filter(Boolean);
  
  return items.filter(item => {
    // Build searchable text from all relevant fields
    const searchableFields = [
      item.title || '',
      item.description || '',
      item.platform || '',
      getContentTypeDisplayName(item.type),
      ...(item.tags || [])
    ];
    
    const searchableText = searchableFields.join(' ');
    
    // All search terms must match somewhere in the item
    return searchTerms.every(term => 
      matchesSearchTerm(searchableText, term)
    );
  });
}

/**
 * Get search suggestions based on current content
 */
export function getSearchSuggestions(items: ContentItem[]): string[] {
  const suggestions = new Set<string>();
  
  items.forEach(item => {
    // Add content type
    suggestions.add(item.type);
    
    // Add platform
    if (item.platform) {
      suggestions.add(item.platform);
    }
    
    // Add tags
    item.tags?.forEach(tag => suggestions.add(tag));
    
    // Add first few words from titles
    if (item.title) {
      const words = item.title.split(/\s+/).slice(0, 3);
      words.forEach(word => {
        if (word.length > 2) {
          suggestions.add(word.toLowerCase());
        }
      });
    }
  });
  
  return Array.from(suggestions).sort();
}

/**
 * Highlight search terms in text for display
 */
export function highlightSearchTerms(text: string, searchQuery: string): string {
  if (!searchQuery.trim()) {
    return text;
  }
  
  const searchTerms = searchQuery.trim().split(/\s+/).filter(Boolean);
  let highlightedText = text;
  
  searchTerms.forEach(term => {
    const regex = new RegExp(`(${term})`, 'gi');
    highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
  });
  
  return highlightedText;
}