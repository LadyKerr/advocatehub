import type { PlatformDetection, ContentType } from './types';

// Basic hostname/path heuristics. Extend over time.
export function platformDetector(rawUrl: string): PlatformDetection {
  let platform = 'unknown';
  let suggestedType: ContentType = 'other';
  try {
    const u = new URL(rawUrl);
    const host = u.hostname.replace(/^www\./, '').toLowerCase();
    const path = u.pathname.toLowerCase();
    platform = host;

    if (/youtube\.com|youtu\.be/.test(host)) {
      platform = 'youtube';
      suggestedType = 'video';
    } else if (/twitch\.tv/.test(host)) {
      platform = 'twitch';
      suggestedType = 'livestream';
    } else if (/medium\.com|dev\.to|hashnode\.dev|hashnode\.com/.test(host)) {
      platform = host.split('.')[0];
      suggestedType = 'blog';
    } else if (/substack\.com/.test(host)) {
      platform = 'substack';
      suggestedType = 'newsletter';
    } else if (/ghost\.org/.test(host) || /\.ghost\.io/.test(host)) {
      platform = 'ghost';
      suggestedType = 'newsletter';
    } else if (/spotify\.com/.test(host) && /\/episode\//.test(path)) {
      platform = 'spotify';
      suggestedType = 'podcast';
    } else if (/podcasts\.apple\.com/.test(host)) {
      platform = 'apple-podcasts';
      suggestedType = 'podcast';
    } else if (/anchor\.fm/.test(host)) {
      platform = 'anchor';
      suggestedType = 'podcast';
    } else if (/eventbrite\.com/.test(host)) {
      platform = 'eventbrite';
      suggestedType = 'webinar';
    } else if (/lu\.ma/.test(host)) {
      platform = 'luma';
      suggestedType = 'webinar';
    } else if (/meetup\.com/.test(host)) {
      platform = 'meetup';
      suggestedType = 'webinar';
    } else if (/codepen\.io/.test(host)) {
      platform = 'codepen';
      suggestedType = 'demo';
    } else if (/codesandbox\.io/.test(host)) {
      platform = 'codesandbox';
      suggestedType = 'demo';
    } else if (/replit\.com/.test(host)) {
      platform = 'replit';
      suggestedType = 'demo';
    } else if (/github\.com/.test(host)) {
      platform = 'github';
      if (/\/releases?\//.test(path) || /\.(md|ts|js|tsx|py|go)$/.test(path)) {
        suggestedType = 'demo';
      } else {
        suggestedType = 'other';
      }
    } else if (/twitter\.com|x\.com/.test(host)) {
      platform = 'x';
      suggestedType = 'social';
    } else if (/linkedin\.com/.test(host)) {
      platform = 'linkedin';
      suggestedType = 'social';
    } else if (/tiktok\.com/.test(host)) {
      platform = 'tiktok';
      suggestedType = 'social';
    }
  } catch {
    // ignore parse errors; fallback values remain
  }
  return { platform, suggestedType };
}
