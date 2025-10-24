# Analytics Dashboard - Quick Start Guide

## Getting Started in 3 Steps

### 1. View the Dashboard

Start your development server:
```bash
npm run dev
```

Then navigate to: **http://localhost:4321/analytics**

### 2. Explore the Features

The dashboard shows three main sections:

**📊 Content Performance**
- View total metrics (views, likes, shares, engagement rate)
- See performance trends over time
- Identify top-performing content
- Compare different content types

**📈 Platform Analytics**
- See content distribution across platforms
- Analyze which platforms drive the most views
- Compare platform-specific engagement rates
- Identify best content types per platform

**📅 Content Calendar**
- Visualize your publishing schedule
- Identify content gaps
- Track publishing patterns
- Navigate month-by-month

### 3. Add Your Own Content

Edit the file: `src/data/sampleContent.ts`

Replace or add to the sample data with your content:

```typescript
{
    id: "my-content-1",
    title: "Your Content Title",
    platform: "YouTube", // or "LinkedIn", "GitHub", "Blog", etc.
    contentType: "Video", // or "Article", "Tutorial", "Demo", etc.
    publishDate: "2025-10-15",
    engagement: {
        views: 1000,
        likes: 50,
        shares: 10,
        comments: 5
    },
    campaign: "Optional Campaign Name",
    url: "https://your-content-url.com"
}
```

## What's Included

### New Files Created

- **`src/pages/analytics.astro`** - Main analytics page
- **`src/libs/ui/components/ContentPerformanceDashboard.tsx`** - Performance metrics component
- **`src/libs/ui/components/PlatformAnalytics.tsx`** - Platform breakdown component
- **`src/libs/ui/components/ContentCalendar.tsx`** - Calendar visualization component
- **`src/types/content.ts`** - TypeScript type definitions
- **`src/data/sampleContent.ts`** - Sample data (replace with your content)
- **`ANALYTICS_DOCS.md`** - Comprehensive documentation

### Dependencies Added

- **recharts** (3.3.0) - Chart library for visualizations

## Key Metrics Explained

- **Views**: Total number of times content was viewed
- **Likes**: Total engagement through likes/reactions
- **Shares**: Times content was shared/reposted
- **Comments**: Number of comments/discussions
- **Avg Engagement Rate**: (Likes + Shares + Comments) / Views × 100

## Tips for Best Results

1. **Consistent Data Entry**: Update metrics regularly for accurate trends
2. **Use Campaigns**: Group related content to track campaign performance
3. **Track Publish Dates**: Ensure publishDate is set to use calendar features
4. **Fill All Platforms**: Add content from all your channels for comprehensive analytics

## Need Help?

- **Full Documentation**: See `ANALYTICS_DOCS.md`
- **Type Definitions**: Check `src/types/content.ts` for data structure
- **Examples**: Review `src/data/sampleContent.ts` for sample data format

## Build for Production

When ready to deploy:

```bash
npm run build
```

The analytics page will be available at `/analytics` on your deployed site.

## What's Next?

The current implementation uses manual data entry. Future enhancements include:

- Automatic syncing with platform APIs
- ROI tracking and conversion metrics
- Advanced filtering and date ranges
- Export and reporting features

Happy tracking! 📊
