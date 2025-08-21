import React, { useState } from 'react';
import { UrlIntakeForm } from './UrlIntakeForm';
import { ContentList } from './ContentList';

export const ContentApp: React.FC = () => {
  const [highlightId, setHighlightId] = useState<string | null>(null);
  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-brand">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <h2 className="text-xl font-semibold tracking-tight text-ink">Content Capture</h2>
          </div>
          <p className="text-sm text-ink/60">Paste your content URL here. ✨</p>
        </div>
        <UrlIntakeForm onDuplicate={(id) => {
          setHighlightId(id);
          setTimeout(() => setHighlightId(null), 2000);
        }} />
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-lg font-semibold text-ink">Your Content Collection</h3>
          </div>
          <ContentList highlightId={highlightId} />
        </div>
      </div>
    </div>
  );
};
