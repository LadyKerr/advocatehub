import React from 'react';
import { subscribe, load } from '../contentStore';
import type { ContentItem } from '../types';
import { ContentCard } from './ContentCard';

interface Props {
  highlightId?: string | null;
}

export const ContentList: React.FC<Props> = ({ highlightId }) => {
  const [items, setItems] = React.useState<ContentItem[]>([]);
  React.useEffect(() => {
    load();
    const unsub = subscribe(setItems);
    return () => unsub();
  }, []);
  if (!items.length) {
    return <p className="text-sm text-ink/50 mt-4 italic">No content yet. Add a URL to get started.</p>;
  }
  return (
    <div className="mt-2 space-y-4">
      {items.map(i => <ContentCard key={i.id} item={i} highlight={i.id === highlightId} />)}
    </div>
  );
};
