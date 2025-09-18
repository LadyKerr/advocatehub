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
    <div className="card-base p-6 bg-white border border-surface-subtle">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-ink" htmlFor="url-input">Add URL</label>
            <span className="text-xs text-ink/50">Auto-detect</span>
          </div>
          <input
            id="url-input"
            className="input text-sm"
            value={url}
            placeholder="Paste your content URL here... ✨"
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) handleSubmit(); }}
          />
          {error && <p className="text-xs text-red-600" role="alert">{error}</p>}
        </div>
        
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <label className="text-xs font-medium text-ink/60" htmlFor="type-select">
              Type Override
            </label>
            <select
              id="type-select"
              className="select text-xs"
              value={manualType}
              onChange={e => setManualType(e.target.value as ContentType | '')}
            >
              <option value="">🪄 Auto-detect (Magical!)</option>
              <option value="blog">📝 Blog Post</option>
              <option value="video">🎥 Video Content</option>
              <option value="podcast">�️ Podcast</option>
              <option value="livestream">📺 Livestream</option>
              <option value="webinar">📊 Webinar/Event</option>
              <option value="newsletter">📧 Newsletter</option>
              <option value="workshop">� Workshop/Tutorial</option>
              <option value="demo">� Demo/Showcase</option>
              <option value="social">💬 Social Post</option>
              <option value="speaking">🎤 Speaking/Talk</option>
              <option value="other">📎 Other</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary text-sm px-6">
            Capture
          </button>
        </div>
        
        {toast && (
          <div className="text-sm text-emerald-600 font-medium" role="status" onAnimationEnd={() => setToast(null)}>
            ✅ {toast}
          </div>
        )}
      </form>
    </div>
  );
};
