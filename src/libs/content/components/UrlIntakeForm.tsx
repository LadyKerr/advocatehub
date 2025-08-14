import React, { useState, useCallback } from 'react';
import { platformDetector } from '../platformDetector';
import { add, exists, load, update, findByUrl } from '../contentStore';
import { unfurl } from '../unfurl';
import type { ContentItem, ContentType } from '../types';

interface Props {
  onDuplicate?: (id: string) => void;
}

export const UrlIntakeForm: React.FC<Props> = ({ onDuplicate }) => {
  const [url, setUrl] = useState('');
  const [manualType, setManualType] = useState<ContentType | ''>('');
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  React.useEffect(() => { load(); }, []);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    const trimmed = url.trim();
    if (!trimmed) return;
    let validUrl: string;
    try {
      const u = new URL(trimmed);
      validUrl = u.toString();
    } catch {
      setError('Invalid URL');
      return;
    }
    if (exists(validUrl)) {
      setToast('Already added');
      const existing = findByUrl(validUrl);
      if (existing && onDuplicate) onDuplicate(existing.id);
      return;
    }
    const { platform, suggestedType } = platformDetector(validUrl);
    const id = (typeof crypto !== 'undefined' && 'randomUUID' in crypto) ? crypto.randomUUID() : Math.random().toString(36).slice(2);
    const initial: ContentItem = {
      id,
      url: validUrl,
      platform,
      type: (manualType || suggestedType) ?? 'other',
      dateAdded: new Date().toISOString(),
      unfurlStatus: 'pending',
      tags: [],
    };
    add(initial);
    setUrl('');

    // Async unfurl
    const result = await unfurl(validUrl);
    update(id, result);
  }, [url, manualType, onDuplicate]);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5 card-base bg-white/80">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium" htmlFor="url-input">Add URL</label>
        <input
          id="url-input"
          className="input"
          value={url}
          placeholder="Paste a link and press Enter"
          onChange={e => setUrl(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) handleSubmit(); }}
        />
        {error && <p className="text-xs text-red-600" role="alert">{error}</p>}
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <label className="text-xs uppercase tracking-wide text-ink/60" htmlFor="type-select">Type Override</label>
        <select
          id="type-select"
          className="select"
          value={manualType}
          onChange={e => setManualType(e.target.value as ContentType | '')}
        >
          <option value="">Auto</option>
          <option value="blog">Blog</option>
            <option value="video">Video</option>
            <option value="social">Social</option>
            <option value="workshop">Workshop</option>
            <option value="demo">Demo</option>
            <option value="other">Other</option>
        </select>
  <button type="submit" className="ml-auto btn btn-primary text-xs">Save</button>
      </div>
      {toast && (
  <div className="text-xs text-ink/70" role="status" onAnimationEnd={() => setToast(null)}>{toast}</div>
      )}
    </form>
  );
};
