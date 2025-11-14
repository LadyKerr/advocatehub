import type { ContentItem } from './types';

interface UnfurlResultPartial extends Partial<ContentItem> {
  unfurlStatus: 'ok' | 'error';
  errorReason?: string;
}

// Server-side unfurl using API endpoint to avoid CORS issues
export async function unfurl(url: string): Promise<UnfurlResultPartial> {
  const start = performance.now();
  console.log('unfurl called for:', url);
  
  try {
    console.log('Making API request to /api/unfurl');
    const res = await fetch('/api/unfurl', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });
    
    console.log('API response status:', res.status); 
    
    if (!res.ok) {
      console.log('unfurl_ms', performance.now() - start, 'api_error', res.status);
      return { unfurlStatus: 'error', errorReason: `api_${res.status}` };
    }
    
    const result = await res.json();
    console.log('API response data:', result);
    const duration = performance.now() - start;
    console.log('unfurl_ms', duration, result.unfurlStatus);
    
    return result;
  } catch (e: any) {
    const duration = performance.now() - start;
    console.log('unfurl_ms', duration, 'error', e?.name || 'unknown', e?.message);
    return { unfurlStatus: 'error', errorReason: e?.name || 'fetch_error' };
  }
}
