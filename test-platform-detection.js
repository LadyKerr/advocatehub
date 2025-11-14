// Simple test to verify platform detection for new content types
// This uses Node.js without any framework dependencies

// Copy the platform detection logic
function platformDetector(rawUrl) {
  let platform = 'unknown';
  let suggestedType = 'other';
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

// Test cases for new content types
const testUrls = [
  // Podcasts
  'https://open.spotify.com/episode/abc123',
  'https://podcasts.apple.com/us/podcast/some-podcast/id123456',
  'https://anchor.fm/my-podcast',
  
  // Newsletters
  'https://newsletter.substack.com/p/latest-post',
  'https://myblog.ghost.io/newsletter-post',
  
  // Events/Webinars
  'https://www.eventbrite.com/e/tech-webinar-tickets-123456',
  'https://lu.ma/event/developer-meetup',
  'https://www.meetup.com/tech-group/events/123456',
  
  // Demos
  'https://codepen.io/user/pen/abc123',
  'https://codesandbox.io/s/react-demo-abc123',
  'https://replit.com/@user/my-project',
  
  // Livestreams
  'https://www.twitch.tv/developer_streams',
  
  // Existing types (should still work)
  'https://youtube.com/watch?v=abc123',
  'https://dev.to/user/my-blog-post',
  'https://github.com/user/repo'
];

console.log('Testing Enhanced Content Type Detection:\n');

testUrls.forEach(url => {
  const result = platformDetector(url);
  console.log(`URL: ${url}`);
  console.log(`  Platform: ${result.platform}`);
  console.log(`  Type: ${result.suggestedType}`);
  console.log('');
});