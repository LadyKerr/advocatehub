import React, { useState } from 'react';
import type { ContentItem, ContentType } from '../types';
import { update } from '../contentStore';

interface Props {
  item: ContentItem;
  highlight?: boolean;
}

const statusColors: Record<ContentItem['unfurlStatus'], string> = {
  pending: 'bg-amber-400',
  ok: 'bg-emerald-500',
  error: 'bg-rose-500',
};

export const ContentCard: React.FC<Props> = ({ item, highlight }) => {
  const [editingTags, setEditingTags] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const addTags = () => {
    if (!tagInput.trim()) return;
    const newTags = tagInput.split(/[\,\s]/).map(t => t.trim()).filter(Boolean);
    const merged = Array.from(new Set([...(item.tags || []), ...newTags]));
    update(item.id, { tags: merged });
    setTagInput('');
    setEditingTags(false);
  };

  const changeType = (t: ContentType) => update(item.id, { type: t });

  return (
    <div className={`relative flex gap-4 p-4 rounded-xl border border-[var(--color-border)] bg-white/70 backdrop-blur-sm shadow-glass hover:border-brand/40 transition ${highlight ? 'ring-2 ring-brand' : ''}`}>
      <div className="w-28 h-20 rounded-lg overflow-hidden bg-pastel-sky flex items-center justify-center text-[11px] text-ink/60 font-medium border border-[var(--color-border)]">
        {item.thumbnailUrl ? (
          <img src={item.thumbnailUrl} alt={item.title || item.platform} className="object-cover w-full h-full" loading="lazy" />
        ) : (
          <span>{item.platform}</span>
        )}
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-start gap-2">
          <a href={item.url} target="_blank" rel="noopener" className="font-medium text-sm truncate hover:underline decoration-brand/40 hover:decoration-brand">
            {item.title || item.url}
          </a>
          <span className={`status-dot ${statusColors[item.unfurlStatus]} ${item.unfurlStatus==='pending' ? 'animate-pulse' : ''}`}></span>
        </div>
        {item.description && <p className="text-xs line-clamp-2 text-ink/60">{item.description}</p>}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <select
            className="text-[10px] px-1.5 py-1 rounded-md border border-[var(--color-border)] bg-white/70 focus:border-brand focus:outline-none"
            value={item.type}
            onChange={e => changeType(e.target.value as ContentType)}
          >
            <option value="blog">blog</option>
            <option value="video">video</option>
            <option value="social">social</option>
            <option value="workshop">workshop</option>
            <option value="demo">demo</option>
            <option value="other">other</option>
          </select>
          <span className="text-[10px] uppercase tracking-wide text-ink/50">{item.platform}</span>
          <div className="flex items-center gap-1 flex-wrap">
            {(item.tags || []).map(t => (
              <span key={t} className="tag">{t}</span>
            ))}
            {editingTags ? (
              <input
                className="text-[10px] px-1.5 py-0.5 bg-white border border-[var(--color-border)] rounded w-24 focus:border-brand focus:outline-none"
                value={tagInput}
                autoFocus
                placeholder="tags"
                onChange={e => setTagInput(e.target.value)}
                onBlur={addTags}
                onKeyDown={e => { if (e.key === 'Enter') addTags(); }}
              />
            ) : (
              <button type="button" className="text-[10px] text-brand hover:underline" onClick={() => setEditingTags(true)}>+ tags</button>
            )}
          </div>
          {item.unfurlStatus === 'error' && (
            <span className="text-[10px] text-rose-600" title={item.errorReason}>unfurl failed</span>
          )}
        </div>
      </div>
    </div>
  );
};
