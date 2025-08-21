import type { APIRoute } from 'astro';

interface UnfurlResponse {
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  unfurlStatus: 'ok' | 'error';
  errorReason?: string;
  sourceMeta?: any;
}

export const POST: APIRoute = async ({ request }) => {
  console.log('Unfurl API called');
  
  try {
    const body = await request.json();
    const { url } = body;
    
    console.log('URL to unfurl:', url);
    
    if (!url || typeof url !== 'string') {
      console.log('Invalid URL provided');
      return new Response(JSON.stringify({ 
        unfurlStatus: 'error', 
        errorReason: 'invalid_url' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate URL
    let validUrl: URL;
    try {
      validUrl = new URL(url);
      console.log('Valid URL:', validUrl.toString());
    } catch (e) {
      console.log('URL validation failed:', e);
      return new Response(JSON.stringify({ 
        unfurlStatus: 'error', 
        errorReason: 'invalid_url' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const start = performance.now();
    
    try {
      console.log('Fetching URL...');
      const response = await fetch(validUrl.toString(), {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; AdvocateHub/1.0)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      });

      console.log('Fetch response status:', response.status);

      if (!response.ok) {
        console.log('HTTP error:', response.status);
        return new Response(JSON.stringify({ 
          unfurlStatus: 'error', 
          errorReason: `http_${response.status}` 
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const html = await response.text();
      console.log('HTML length:', html.length);
      
      // Simple regex-based parsing
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      const title = titleMatch?.[1]?.trim();
      
      const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
      const ogTitle = ogTitleMatch?.[1];
      
      const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
      const ogDescription = ogDescMatch?.[1];
      
      const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
      const ogImage = ogImageMatch?.[1];

      const finalTitle = ogTitle || title;
      const duration = performance.now() - start;
      
      console.log('Parsed data:', { finalTitle, ogDescription, ogImage });
      console.log('unfurl_server_ms', duration, 'ok');

      const result: UnfurlResponse = {
        title: finalTitle,
        description: ogDescription || undefined,
        thumbnailUrl: ogImage || undefined,
        unfurlStatus: 'ok',
        sourceMeta: ogTitle ? { og: { 'og:title': ogTitle } } : undefined
      };

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (error: any) {
      const duration = performance.now() - start;
      console.log('Fetch error:', error.message);
      console.log('unfurl_server_ms', duration, 'error', error?.name || 'unknown');
      
      return new Response(JSON.stringify({ 
        unfurlStatus: 'error', 
        errorReason: error?.name || 'fetch_error' 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (error: any) {
    console.error('API unfurl error:', error);
    return new Response(JSON.stringify({ 
      unfurlStatus: 'error', 
      errorReason: 'server_error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
