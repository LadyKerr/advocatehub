import type { ContentItem } from './types';

interface UnfurlResultPartial extends Partial<ContentItem> {
  unfurlStatus: 'ok' | 'error';
  errorReason?: string;
}

// Lightweight client-side unfurl using Open Graph tags. CORS failures are expected for some hosts.
export async function unfurl(url: string): Promise<UnfurlResultPartial> {
  const start = performance.now();
  try {
    const res = await fetch(url, { method: 'GET', mode: 'cors' });
    if (!res.ok) {
      console.log('unfurl_ms', performance.now() - start, 'http_error', res.status);
      return { unfurlStatus: 'error', errorReason: `http_${res.status}` };
    }
    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const get = (sel: string) => doc.querySelector(sel)?.getAttribute('content') || undefined;
    const og: Record<string, string> = {};
    doc.querySelectorAll('meta[property^="og:"]').forEach(m => {
      const prop = m.getAttribute('property');
      const content = m.getAttribute('content');
      if (prop && content) og[prop] = content;
    });
    const title = get('meta[property="og:title"]') || doc.querySelector('title')?.textContent?.trim();
    const description = get('meta[property="og:description"]') || get('meta[name="description"]');
    const thumbnailUrl = get('meta[property="og:image"]') || get('meta[name="twitter:image"]');
    const duration = performance.now() - start;
    console.log('unfurl_ms', duration, 'ok');
    return {
      title,
      description: description || undefined,
      thumbnailUrl: thumbnailUrl || undefined,
      unfurlStatus: 'ok',
      sourceMeta: Object.keys(og).length ? { og } : undefined
    };
  } catch (e: any) {
    const duration = performance.now() - start;
    console.log('unfurl_ms', duration, 'error', e?.name || 'unknown');
    return { unfurlStatus: 'error', errorReason: e?.name || 'fetch_error' };
  }
}
