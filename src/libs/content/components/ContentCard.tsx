import React, { useState } from 'react';
import type { ContentItem, ContentType } from '../types';
import { update } from '../contentStore';

interface Props {
  item: ContentItem;
  highlight?: boolean;
  viewMode?: 'grid' | 'list';
}

const statusColors: Record<ContentItem['unfurlStatus'], string> = {
  pending: 'bg-amber-400',
  ok: 'bg-emerald-500',
  error: 'bg-rose-500',
};

export const ContentCard: React.FC<Props> = ({ item, highlight, viewMode = 'list' }) => {
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

  if (viewMode === 'grid') {
    return (
      <div className={`card-base bg-white hover:shadow-lg transition-all duration-200 overflow-hidden ${highlight ? 'ring-2 ring-brand ring-opacity-50 shadow-lg' : ''}`}>
        {/* Thumbnail */}
        <div className="aspect-video w-full overflow-hidden bg-gradient-to-br from-pastel-sky to-pastel-lavender">
          {item.thumbnailUrl ? (
            <img 
              src={item.thumbnailUrl} 
              alt={item.title || item.platform} 
              className="object-cover w-full h-full" 
              loading="lazy" 
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-3xl mb-2">
                  {item.type === 'video' && '🎥'}
                  {item.type === 'blog' && '📝'}
                  {item.type === 'social' && '💬'}
                  {item.type === 'workshop' && '🎓'}
                  {item.type === 'demo' && '🚀'}
                  {item.type === 'podcast' && '🎙️'}
                  {item.type === 'livestream' && '📺'}
                  {item.type === 'webinar' && '📊'}
                  {item.type === 'newsletter' && '📧'}
                  {item.type === 'speaking' && '🎤'}
                  {item.type === 'other' && '📎'}
                </div>
                <span className="text-sm text-ink/60 font-medium">{item.platform}</span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Header with title and status */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <a 
                href={item.url} 
                target="_blank" 
                rel="noopener" 
                className="font-semibold text-sm text-ink hover:text-brand transition-colors line-clamp-2 leading-tight flex-1"
              >
                {item.title || item.url}
              </a>
              <div className="flex items-center gap-1 flex-shrink-0">
                <span className={`status-dot ${statusColors[item.unfurlStatus]} ${item.unfurlStatus==='pending' ? 'animate-pulse' : ''}`}></span>
                {item.unfurlStatus === 'error' && (
                  <span className="text-[10px] text-rose-600" title={item.errorReason}>⚠️</span>
                )}
              </div>
            </div>
            
            {item.description && (
              <p className="text-xs text-ink/60 line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            )}
          </div>

          {/* Metadata */}
          <div className="space-y-2">
            {/* Type and platform */}
            <div className="flex items-center gap-2">
              <select
                className="text-xs px-2 py-1 rounded-md border border-surface-subtle bg-white hover:border-brand focus:border-brand focus:outline-none transition-colors flex-1"
                value={item.type}
                onChange={e => changeType(e.target.value as ContentType)}
              >
                <option value="blog">📝 blog</option>
                <option value="video">🎥 video</option>
                <option value="social">💬 social</option>
                <option value="workshop">🎓 workshop</option>
                <option value="demo">🚀 demo</option>
                <option value="podcast">🎙️ podcast</option>
                <option value="livestream">📺 livestream</option>
                <option value="webinar">📊 webinar</option>
                <option value="newsletter">📧 newsletter</option>
                <option value="speaking">🎤 speaking</option>
                <option value="other">📎 other</option>
              </select>
              
              <span className="text-xs px-2 py-1 bg-pastel-sky rounded-md text-ink/70 font-medium">
                {item.platform}
              </span>
            </div>
            
            {/* Tags */}
            <div className="flex items-center gap-1 flex-wrap min-h-[24px]">
              {(item.tags || []).map(t => (
                <span key={t} className="tag text-xs">{t}</span>
              ))}
              {editingTags ? (
                <input
                  className="text-xs px-2 py-1 bg-white border border-surface-subtle rounded-md w-20 focus:border-brand focus:outline-none"
                  value={tagInput}
                  autoFocus
                  placeholder="add tag"
                  onChange={e => setTagInput(e.target.value)}
                  onBlur={addTags}
                  onKeyDown={e => { if (e.key === 'Enter') addTags(); }}
                />
              ) : (
                <button 
                  type="button" 
                  className="text-xs text-brand hover:text-brand-fg hover:bg-brand px-2 py-1 rounded-md transition-all" 
                  onClick={() => setEditingTags(true)}
                >
                  + tag
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List view (original design)
  return (
    <div className={`card-base p-5 bg-white hover:shadow-lg transition-all duration-200 ${highlight ? 'ring-2 ring-brand ring-opacity-50 shadow-lg' : ''}`}>
      <div className="flex gap-4">
        {/* Thumbnail */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-pastel-sky to-pastel-lavender flex items-center justify-center border border-surface-subtle">
            {item.thumbnailUrl ? (
              <img 
                src={item.thumbnailUrl} 
                alt={item.title || item.platform} 
                className="object-cover w-full h-full" 
                loading="lazy" 
              />
            ) : (
              <div className="text-center">
                <div className="text-xl mb-1">
                  {item.type === 'video' && '🎥'}
                  {item.type === 'blog' && '📝'}
                  {item.type === 'social' && '💬'}
                  {item.type === 'workshop' && '🎓'}
                  {item.type === 'demo' && '🚀'}
                  {item.type === 'podcast' && '🎙️'}
                  {item.type === 'livestream' && '📺'}
                  {item.type === 'webinar' && '📊'}
                  {item.type === 'newsletter' && '📧'}
                  {item.type === 'speaking' && '🎤'}
                  {item.type === 'other' && '📎'}
                </div>
                <span className="text-[10px] text-ink/60 font-medium">{item.platform}</span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* Header with title and status */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <a 
                href={item.url} 
                target="_blank" 
                rel="noopener" 
                className="font-semibold text-sm text-ink hover:text-brand transition-colors line-clamp-2 leading-snug"
              >
                {item.title || item.url}
              </a>
              {item.description && (
                <p className="text-xs text-ink/60 mt-1 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={`status-dot ${statusColors[item.unfurlStatus]} ${item.unfurlStatus==='pending' ? 'animate-pulse' : ''}`}></span>
              {item.unfurlStatus === 'error' && (
                <span className="text-[10px] text-rose-600" title={item.errorReason}>⚠️</span>
              )}
            </div>
          </div>

          {/* Metadata row */}
          <div className="flex items-center gap-3 flex-wrap">
            <select
              className="text-xs px-2 py-1 rounded-md border border-surface-subtle bg-white hover:border-brand focus:border-brand focus:outline-none transition-colors"
              value={item.type}
              onChange={e => changeType(e.target.value as ContentType)}
            >
              <option value="blog">📝 blog</option>
              <option value="video">🎥 video</option>
              <option value="social">💬 social</option>
              <option value="workshop">🎓 workshop</option>
              <option value="demo">🚀 demo</option>
              <option value="podcast">🎙️ podcast</option>
              <option value="livestream">📺 livestream</option>
              <option value="webinar">📊 webinar</option>
              <option value="newsletter">📧 newsletter</option>
              <option value="speaking">🎤 speaking</option>
              <option value="other">📎 other</option>
            </select>
            
            <span className="text-xs px-2 py-1 bg-pastel-sky rounded-md text-ink/70 font-medium">
              {item.platform}
            </span>
            
            <div className="flex items-center gap-1 flex-wrap">
              {(item.tags || []).map(t => (
                <span key={t} className="tag text-xs">{t}</span>
              ))}
              {editingTags ? (
                <input
                  className="text-xs px-2 py-1 bg-white border border-surface-subtle rounded-md w-20 focus:border-brand focus:outline-none"
                  value={tagInput}
                  autoFocus
                  placeholder="add tag"
                  onChange={e => setTagInput(e.target.value)}
                  onBlur={addTags}
                  onKeyDown={e => { if (e.key === 'Enter') addTags(); }}
                />
              ) : (
                <button 
                  type="button" 
                  className="text-xs text-brand hover:text-brand-fg hover:bg-brand px-2 py-1 rounded-md transition-all" 
                  onClick={() => setEditingTags(true)}
                >
                  + tag
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
