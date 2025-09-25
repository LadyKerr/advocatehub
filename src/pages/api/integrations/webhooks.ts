// Webhook API Routes for Integration & Automation Hub

import type { APIRoute } from 'astro';
import { contentStore } from '../../../libs/integrations/contentStore';
import type { WebhookConfig, WebhookPayload, ContentItem, APIResponse } from '../../../types/integration';
import { createHmac } from 'node:crypto';

// POST /api/integrations/webhooks/[platform] - Receive webhook from external platform
export const POST: APIRoute = async ({ request, params }) => {
  try {
    const platform = params.platform as string;
    const body = await request.text();
    const headers = Object.fromEntries(request.headers.entries());

    // Get webhook configuration
    const integrations = await contentStore.getAllIntegrations();
    const webhookConfig = integrations.find(i => 
      i.platform === platform && 'webhookUrl' in i.config
    ) as WebhookConfig | undefined;

    if (!webhookConfig || !webhookConfig.enabled) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Webhook not configured or disabled'
      } as APIResponse), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verify webhook signature if secret is configured
    if (webhookConfig.config.secret) {
      const signature = headers['x-hub-signature-256'] || headers['x-signature-256'];
      if (!signature || !verifyWebhookSignature(body, webhookConfig.config.secret, signature)) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Invalid webhook signature'
        } as APIResponse), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    const payload: WebhookPayload = {
      source: platform,
      event: headers['x-github-event'] || headers['x-event-type'] || 'unknown',
      timestamp: new Date().toISOString(),
      data: JSON.parse(body),
      signature: headers['x-hub-signature-256'] || headers['x-signature-256']
    };

    // Process webhook based on platform
    let contentItem: Partial<ContentItem> | null = null;

    switch (platform) {
      case 'github':
        contentItem = await processGitHubWebhook(payload);
        break;
      case 'youtube':
        contentItem = await processYouTubeWebhook(payload);
        break;
      case 'blog':
        contentItem = await processBlogWebhook(payload);
        break;
      default:
        return new Response(JSON.stringify({
          success: false,
          error: `Unsupported webhook platform: ${platform}`
        } as APIResponse), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
    }

    // Import content if created
    if (contentItem) {
      const importResult = await contentStore.importBulkContent([contentItem]);
      
      return new Response(JSON.stringify({
        success: true,
        data: importResult,
        message: `Webhook processed successfully: ${importResult.summary}`
      } as APIResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Webhook received but no content was created'
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

// GET /api/integrations/webhooks - List webhook configurations
export const GET: APIRoute = async () => {
  try {
    const integrations = await contentStore.getAllIntegrations();
    const webhookConfigs = integrations.filter(i => 
      ['github', 'youtube', 'blog', 'social'].includes(i.platform)
    );

    return new Response(JSON.stringify({
      success: true,
      data: webhookConfigs
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

// Helper functions for webhook processing
async function processGitHubWebhook(payload: WebhookPayload): Promise<Partial<ContentItem> | null> {
  const { event, data } = payload;

  switch (event) {
    case 'release':
      if (data.action === 'published') {
        return {
          title: `Release: ${data.release.tag_name}`,
          description: data.release.name || data.release.body?.substring(0, 200) || '',
          content: data.release.body || '',
          type: 'release',
          url: data.release.html_url,
          publishedAt: data.release.published_at || new Date().toISOString(),
          tags: ['release', 'github', data.repository.name],
          importSource: {
            type: 'webhook',
            sourceUrl: data.repository.html_url,
            importedAt: new Date().toISOString(),
            originalId: data.release.id.toString()
          },
          metadata: {
            repository: data.repository.full_name,
            author: data.release.author.login,
            tagName: data.release.tag_name,
            isDraft: data.release.draft,
            isPrerelease: data.release.prerelease
          }
        };
      }
      break;

    case 'push':
      if (data.commits && data.commits.length > 0) {
        const commit = data.commits[0]; // Take the latest commit
        return {
          title: `Code Update: ${commit.message}`,
          description: `New commits pushed to ${data.repository.full_name}`,
          content: commit.message,
          type: 'article',
          url: commit.url,
          publishedAt: commit.timestamp || new Date().toISOString(),
          tags: ['commit', 'github', data.repository.name],
          importSource: {
            type: 'webhook',
            sourceUrl: data.repository.html_url,
            importedAt: new Date().toISOString(),
            originalId: commit.id
          },
          metadata: {
            repository: data.repository.full_name,
            author: commit.author.name,
            commitId: commit.id,
            branch: data.ref.replace('refs/heads/', '')
          }
        };
      }
      break;
  }

  return null;
}

async function processYouTubeWebhook(payload: WebhookPayload): Promise<Partial<ContentItem> | null> {
  const { data } = payload;

  // YouTube webhook structure varies, this is a basic implementation
  if (data.snippet) {
    return {
      title: data.snippet.title,
      description: data.snippet.description?.substring(0, 200) || '',
      content: data.snippet.description || '',
      type: 'video',
      url: `https://www.youtube.com/watch?v=${data.id}`,
      publishedAt: data.snippet.publishedAt || new Date().toISOString(),
      tags: data.snippet.tags || ['youtube', 'video'],
      importSource: {
        type: 'webhook',
        sourceUrl: data.snippet.channelId,
        importedAt: new Date().toISOString(),
        originalId: data.id
      },
      metadata: {
        channelId: data.snippet.channelId,
        channelTitle: data.snippet.channelTitle,
        duration: data.contentDetails?.duration,
        viewCount: data.statistics?.viewCount
      }
    };
  }

  return null;
}

async function processBlogWebhook(payload: WebhookPayload): Promise<Partial<ContentItem> | null> {
  const { data } = payload;

  // Generic blog webhook processing
  if (data.title && data.content) {
    return {
      title: data.title,
      description: data.excerpt || data.description || '',
      content: data.content,
      type: 'blog-post',
      url: data.url || data.permalink,
      publishedAt: data.publishedAt || data.date || new Date().toISOString(),
      tags: data.tags || data.categories || ['blog'],
      importSource: {
        type: 'webhook',
        sourceUrl: data.blogUrl || payload.source,
        importedAt: new Date().toISOString(),
        originalId: data.id?.toString() || data.slug
      },
      metadata: {
        author: data.author,
        blogTitle: data.blogTitle,
        slug: data.slug,
        status: data.status
      }
    };
  }

  return null;
}

function verifyWebhookSignature(payload: string, secret: string, signature: string): boolean {
  try {
    const expectedSignature = 'sha256=' + createHmac('sha256', secret).update(payload).digest('hex');
    return signature === expectedSignature;
  } catch {
    return false;
  }
}