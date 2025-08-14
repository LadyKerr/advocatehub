### Idea: 
I want to build an app that easily allows developer advocates to keep track of all the content they create. Advocates create a mixture of technical blog posts, short form videos for social media, long form youtube videos, webinars, livestreams, workshops, and demo content. They often use different platforms such as twitch, youtube, github, eventbrite, meetup, Linkedin, tiktok, instagram,facebook, Bluesky, so it is hard to keep track of the content created so a dedicated app would help.

I want users to be able to add a link to the content produced, choose the type of content, then click upload. The app then organizes the content for the user and unfurls the URL to show a preview.

They should be able to group related content together, as there are usually campaigns attached to the work.

The aim is VERY LOW FRICTION tracking, as advocates are usually very busy.
Core flow: paste URL → auto-categorize → organize.

### App Name: AdvocateHub

### Tech Stack:
- Astro
- React
- TypeScript
- Tailwind

### Core Features:
- Simple URL input + manual content type selection
- Basic unfurling (title, description, thumbnail when possible)
- Simple list/grid organization with filtering
- Manual tagging
- Bulk import from RSS Feeds

### Mock Data Structure:

```js
type Content = {
  id: string;
  url: string;
  type: 'blog' | 'video' | 'social' | 'workshop' | 'demo';
  title: string; // extracted from URL or manual
  platform: string; // auto-detected from URL
  dateAdded: Date;
  tags?: string[];
}
```
