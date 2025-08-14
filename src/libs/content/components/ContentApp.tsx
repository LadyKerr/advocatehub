import React, { useState } from 'react';
import { UrlIntakeForm } from './UrlIntakeForm';
import { ContentList } from './ContentList';

export const ContentApp: React.FC = () => {
  const [highlightId, setHighlightId] = useState<string | null>(null);
  return (
    <div className="max-w-3xl mx-auto w-full space-y-6">
      <h2 className="text-2xl font-semibold tracking-tight">Content Capture</h2>
      <UrlIntakeForm onDuplicate={(id) => {
        setHighlightId(id);
        setTimeout(() => setHighlightId(null), 2000);
      }} />
      <ContentList highlightId={highlightId} />
    </div>
  );
};
