// RSS Feed Integration API Routes

import type { APIRoute } from 'astro';
import { rssParser } from '../../../libs/integrations/rssParser';
import { contentStore } from '../../../libs/integrations/contentStore';
import type { RSSFeedConfig, APIResponse } from '../../../types/integration';

// GET /api/integrations/rss - List RSS configurations
// POST /api/integrations/rss - Add/Update RSS configuration
// DELETE /api/integrations/rss - Remove RSS configuration
export const GET: APIRoute = async ({ url }) => {
  try {
    const searchParams = new URL(url).searchParams;
    const action = searchParams.get('action');

    if (action === 'validate') {
      const feedUrl = searchParams.get('url');
      if (!feedUrl) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Feed URL is required'
        } as APIResponse), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const validation = await rssParser.validateFeedUrl(feedUrl);
      return new Response(JSON.stringify({
        success: validation.valid,
        data: validation.feedInfo,
        error: validation.error
      } as APIResponse), {
        status: validation.valid ? 200 : 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // List RSS configurations
    const integrations = await contentStore.getAllIntegrations();
    const rssConfigs = integrations.filter(i => i.platform === 'rss');

    return new Response(JSON.stringify({
      success: true,
      data: rssConfigs
    } as APIResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    } as APIResponse), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { action, config } = body;

    if (action === 'import') {
      // Import content from RSS feed
      if (!config || !config.config?.feedUrl) {
        return new Response(JSON.stringify({
          success: false,
          error: 'RSS configuration with feedUrl is required'
        } as APIResponse), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const result = await rssParser.importFromRSSFeed(config as RSSFeedConfig);
      return new Response(JSON.stringify({
        success: result.success,
        data: result,
        message: result.summary
      } as APIResponse), {
        status: result.success ? 200 : 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Add/Update RSS configuration
    if (!config || !config.config?.feedUrl) {
      return new Response(JSON.stringify({
        success: false,
        error: 'RSS configuration with feedUrl is required'
      } as APIResponse), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate feed URL before saving
    const validation = await rssParser.validateFeedUrl(config.config.feedUrl);
    if (!validation.valid) {
      return new Response(JSON.stringify({
        success: false,
        error: `Invalid RSS feed: ${validation.error}`
      } as APIResponse), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create RSS configuration with defaults
    const rssConfig: RSSFeedConfig = {
      platform: 'rss',
      enabled: config.enabled !== false,
      config: {
        feedUrl: config.config.feedUrl,
        feedTitle: config.config.feedTitle || validation.feedInfo?.title || 'Unknown Feed',
        checkInterval: config.config.checkInterval || 60, // Default: 1 hour
        autoImport: config.config.autoImport !== false,
        contentTypeMapping: config.config.contentTypeMapping || {}
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await contentStore.saveIntegration(rssConfig);

    // Set up scheduled check if enabled
    if (rssConfig.enabled && rssConfig.config.autoImport) {
      await rssParser.scheduleCheck(rssConfig);
    }

    return new Response(JSON.stringify({
      success: true,
      data: rssConfig,
      message: 'RSS feed configuration saved successfully'
    } as APIResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    } as APIResponse), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ url }) => {
  try {
    const searchParams = new URL(url).searchParams;
    const feedUrl = searchParams.get('feedUrl');

    if (!feedUrl) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Feed URL is required'
      } as APIResponse), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Find and delete the RSS configuration
    const integrations = await contentStore.getAllIntegrations();
    const rssConfig = integrations.find(i => 
      i.platform === 'rss' && 
      (i as RSSFeedConfig).config.feedUrl === feedUrl
    ) as RSSFeedConfig | undefined;

    if (!rssConfig) {
      return new Response(JSON.stringify({
        success: false,
        error: 'RSS configuration not found'
      } as APIResponse), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await contentStore.deleteIntegration(`rss-${feedUrl}`);

    return new Response(JSON.stringify({
      success: true,
      message: 'RSS configuration deleted successfully'
    } as APIResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    } as APIResponse), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};