# Analytics Dashboard Documentation

## Overview

The Analytics Dashboard provides comprehensive performance tracking capabilities for content advocates. It helps you understand content impact, identify optimization opportunities, and make data-driven decisions about your advocacy strategy.

## Features

### 1. Content Performance Dashboard

**Location**: `/analytics` - Top section

**What it shows**:
- **Metric Cards**: Quick overview of total views, likes, shares, and average engagement rate
- **Performance Over Time**: Line chart showing how views and engagement trend across your content timeline
- **Performance by Content Type**: Bar chart comparing average views and engagement for different content types (Video, Article, Tutorial, Demo, Post)
- **Top Performing Content**: Ranked list of your top 5 best-performing pieces of content with detailed metrics

**How to use it**:
- Identify which types of content resonate most with your audience
- Spot trends in engagement over time
- Recognize your most successful content to replicate that success

### 2. Platform Analytics

**Location**: `/analytics` - Middle section

**What it shows**:
- **Content Distribution**: Pie chart showing how your content is distributed across platforms (YouTube, LinkedIn, GitHub, Blog, etc.)
- **Views Distribution**: Pie chart showing where your views are coming from
- **Platform Performance Table**: Detailed breakdown showing:
  - Content count per platform
  - Total views per platform
  - Total engagement per platform
  - Average engagement rate
  - Most popular content type on each platform

**How to use it**:
- Determine which platforms are most effective for your content
- Identify opportunities to expand on underutilized platforms
- Optimize content types for each platform based on performance data

### 3. Content Calendar

**Location**: `/analytics` - Bottom section

**What it shows**:
- **Publishing Metrics**: Summary cards showing total publishing days, average content per day, and most active publishing day
- **Calendar View**: Interactive monthly calendar showing:
  - Days with published content (highlighted in blue)
  - Platform badges on content days
  - Number of pieces published on busy days
- **Navigation**: Month-by-month navigation to view historical publishing patterns

**How to use it**:
- Identify gaps in your publishing schedule
- Maintain consistent engagement by planning content in advance
- Recognize patterns in high-activity vs. quiet periods
- Ensure balanced content distribution across time

## Data Model

### ContentItem Interface

```typescript
interface ContentItem {
    id: string;
    title: string;
    platform: Platform; // "YouTube" | "LinkedIn" | "GitHub" | "Twitter" | "Blog" | "Other"
    contentType: ContentType; // "Video" | "Article" | "Post" | "Tutorial" | "Demo" | "Other"
    publishDate?: string; // ISO 8601 date string
    engagement?: ContentEngagement;
    campaign?: string; // Group related content
    url?: string;
}
```

### ContentEngagement Interface

```typescript
interface ContentEngagement {
    views?: number;
    likes?: number;
    shares?: number;
    comments?: number;
}
```

## Adding Your Own Content Data

Currently, the dashboard displays sample data from `src/data/sampleContent.ts`. To add your own content:

### Option 1: Manual Entry (Current Implementation)

1. Edit `src/data/sampleContent.ts`
2. Add your content items following the `ContentItem` interface
3. Include engagement metrics as they become available

Example:
```typescript
{
    id: "unique-id",
    title: "My Awesome Video",
    platform: "YouTube",
    contentType: "Video",
    publishDate: "2025-10-15",
    engagement: {
        views: 5000,
        likes: 250,
        shares: 45,
        comments: 30
    },
    campaign: "Product Launch",
    url: "https://youtube.com/watch?v=..."
}
```

### Option 2: API Integration (Future Enhancement)

For production use, integrate with platform APIs:
- **YouTube**: YouTube Analytics API
- **LinkedIn**: LinkedIn Analytics API
- **GitHub**: GitHub API for repository/discussion metrics
- **Twitter**: Twitter Analytics API
- **Custom Blog**: Google Analytics or similar

## Accessing the Dashboard

1. **Development**: Navigate to `http://localhost:4321/analytics` when running `npm run dev`
2. **Production**: The analytics page will be available at `https://yourdomain.com/analytics`

## Key Insights & Best Practices

### Performance Tracking
- Monitor views, likes, shares, and comments to understand what resonates
- Track engagement trends over time to identify successful patterns
- Compare content types to optimize your content mix

### Platform Optimization
- Focus efforts on platforms with highest engagement rates
- Tailor content types to platform preferences
- Cross-post strategically based on platform performance

### Publishing Patterns
- Maintain consistent publishing schedule
- Identify and fill content gaps
- Plan campaigns around high-engagement periods

## Future Enhancements

The following features are planned for future releases:

1. **ROI Tracking**:
   - Connect content to business metrics (leads, sign-ups, conversions)
   - Attribution tracking from content to outcomes
   - Campaign performance measurement

2. **Advanced Filtering**:
   - Date range selection
   - Campaign-based filtering
   - Platform-specific deep dives

3. **Export & Reporting**:
   - PDF report generation
   - CSV data export
   - Scheduled email reports

4. **Real-time Updates**:
   - Automatic syncing with platform APIs
   - Live engagement tracking
   - Push notifications for milestone achievements

## Technical Details

- **Chart Library**: Recharts (lightweight, React-compatible)
- **Styling**: Tailwind CSS (matching existing design system)
- **Type Safety**: Full TypeScript support
- **Performance**: Static site generation with client-side hydration for interactivity
- **Bundle Size**: Optimized with code splitting and compression

## Support

For questions or issues with the analytics dashboard:
- Check the issue tracker on GitHub
- Review the TypeScript types for data structure requirements
- Refer to Recharts documentation for chart customization options
