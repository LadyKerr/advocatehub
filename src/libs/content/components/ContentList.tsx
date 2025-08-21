import React from 'react';
import { subscribe, load } from '../contentStore';
import type { ContentItem } from '../types';
import { ContentCard } from './ContentCard';

interface Props {
  highlightId?: string | null;
}

export const ContentList: React.FC<Props> = ({ highlightId }) => {
  const [items, setItems] = React.useState<ContentItem[]>([]);
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  
  React.useEffect(() => {
    load();
    const unsub = subscribe(setItems);
    return () => unsub();
  }, []);
  
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
  
  return (
    <div className="space-y-4">
      {/* View Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-ink/60">
          <span>All Content</span>
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
        {items.map(i => 
          <ContentCard 
            key={i.id} 
            item={i} 
            highlight={i.id === highlightId} 
            viewMode={viewMode}
          />
        )}
      </div>
    </div>
  );
};
