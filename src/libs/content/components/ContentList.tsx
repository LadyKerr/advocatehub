import React from 'react';
import { subscribe, load } from '../contentStore';
import type { ContentItem, ContentType } from '../types';
import { ContentCard } from './ContentCard';
import { SearchBar } from './SearchBar';
import { searchContentItems } from '../searchUtils';

interface Props {
  highlightId?: string | null;
}

type FilterType = 'all' | ContentType;

const filterOptions = [
  { value: 'all' as FilterType, label: '⭐ All Content', icon: '⭐' },
  { value: 'blog' as FilterType, label: '📝 Blogs', icon: '📝' },
  { value: 'video' as FilterType, label: '🎥 Videos', icon: '🎥' },
  { value: 'podcast' as FilterType, label: '🎙️ Podcasts', icon: '🎙️' },
  { value: 'livestream' as FilterType, label: '� Livestreams', icon: '📺' },
  { value: 'webinar' as FilterType, label: '📊 Webinars', icon: '📊' },
  { value: 'newsletter' as FilterType, label: '📧 Newsletters', icon: '�' },
  { value: 'workshop' as FilterType, label: '🎓 Workshops', icon: '🎓' },
  { value: 'demo' as FilterType, label: '🚀 Demos', icon: '🚀' },
  { value: 'social' as FilterType, label: '💬 Social', icon: '💬' },
  { value: 'speaking' as FilterType, label: '🎤 Speaking', icon: '🎤' },
  { value: 'other' as FilterType, label: '📎 Other', icon: '📎' },
];

export const ContentList: React.FC<Props> = ({ highlightId }) => {
  const [items, setItems] = React.useState<ContentItem[]>([]);
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = React.useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  
  React.useEffect(() => {
    load();
    const unsub = subscribe(setItems);
    return () => unsub();
  }, []);

  // Filter and search items
  const filteredItems = React.useMemo(() => {
    let result = items;
    
    // Apply type filter
    if (filter !== 'all') {
      result = result.filter(item => item.type === filter);
    }
    
    // Apply search
    if (searchQuery.trim()) {
      result = searchContentItems(result, searchQuery);
    }
    
    return result;
  }, [items, filter, searchQuery]);
  
  if (!items.length) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-pastel-sky rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </div>
        <p className="text-sm text-ink/50 mb-2">No content yet</p>
        <p className="text-xs text-ink/40">Add a URL above to get started</p>
      </div>
    );
  }

  const selectedFilter = filterOptions.find(opt => opt.value === filter) || filterOptions[0];
  
  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <SearchBar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="Search content, tags, platforms, titles..."
      />
      
      {/* View Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Filter icon */}
          <svg className="w-4 h-4 text-ink/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          
          {/* Filter Dropdown */}
          <div className="relative">
            <select 
              className="appearance-none bg-white border border-surface-subtle rounded-lg px-3 py-2 pr-8 text-sm text-ink/80 cursor-pointer hover:border-brand focus:border-brand focus:outline-none transition-colors"
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterType)}
            >
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            {/* Custom dropdown arrow */}
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-ink/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-white border border-surface-subtle rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'grid' 
                ? 'bg-brand text-white' 
                : 'text-ink/60 hover:text-ink hover:bg-gray-50'
            }`}
            title="Grid view"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'list' 
                ? 'bg-brand text-white' 
                : 'text-ink/60 hover:text-ink hover:bg-gray-50'
            }`}
            title="List view"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Content Grid/List */}
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" 
        : "grid gap-4"
      }>
        {filteredItems.map(i => 
          <ContentCard 
            key={i.id} 
            item={i} 
            highlight={i.id === highlightId} 
            viewMode={viewMode}
            searchQuery={searchQuery}
          />
        )}
      </div>
      
      {/* No filtered results message */}
      {filteredItems.length === 0 && items.length > 0 && (
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-pastel-sky flex items-center justify-center">
            {searchQuery ? (
              <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            ) : (
              <span className="text-lg">{selectedFilter.icon}</span>
            )}
          </div>
          <p className="text-sm text-ink/60 mb-1">
            {searchQuery 
              ? `No content found for "${searchQuery}"` 
              : `No ${filter === 'all' ? 'content' : selectedFilter.label.toLowerCase()} found`
            }
          </p>
          <p className="text-xs text-ink/40">
            {searchQuery 
              ? 'Try different search terms or clear the search to see all content'
              : 'Try selecting a different filter or add more content'
            }
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="mt-3 text-sm text-brand hover:text-brand-fg underline"
            >
              Clear search
            </button>
          )}
        </div>
      )}
    </div>
  );
};
