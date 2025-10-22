export type Platform = "YouTube" | "LinkedIn" | "GitHub" | "Twitter" | "Blog" | "Other";

export type ContentType = "Video" | "Article" | "Post" | "Tutorial" | "Demo" | "Other";

export interface ContentEngagement {
    views?: number;
    likes?: number;
    shares?: number;
    comments?: number;
}

export interface ContentItem {
    id: string;
    title: string;
    platform: Platform;
    contentType: ContentType;
    publishDate?: string;
    engagement?: ContentEngagement;
    campaign?: string;
    url?: string;
}

export interface PlatformStats {
    platform: Platform;
    totalContent: number;
    totalViews: number;
    totalEngagement: number;
    avgEngagementRate: number;
    topContentType: ContentType;
}

export interface PerformanceMetrics {
    totalViews: number;
    totalLikes: number;
    totalShares: number;
    totalComments: number;
    avgEngagementRate: number;
    topPerformer?: ContentItem;
}
