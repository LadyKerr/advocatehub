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
      suggestedType = 'video';
    } else if (/medium\.com|dev\.to|hashnode\.dev|hashnode\.com/.test(host)) {
      platform = host.split('.')[0];
      suggestedType = 'blog';
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
