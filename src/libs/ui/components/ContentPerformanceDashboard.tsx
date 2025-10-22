import { type FC } from "react";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { TrendingUp, Eye, Heart, Share2, MessageCircle } from "lucide-react";
import type { ContentItem, PerformanceMetrics } from "../../types/content";

type ContentPerformanceDashboardProps = {
    contentData: ContentItem[];
};

export const ContentPerformanceDashboard: FC<
    ContentPerformanceDashboardProps
> = ({ contentData }) => {
    // Calculate overall metrics
    const calculateMetrics = (): PerformanceMetrics => {
        const totalViews = contentData.reduce(
            (sum, item) => sum + (item.engagement?.views || 0),
            0
        );
        const totalLikes = contentData.reduce(
            (sum, item) => sum + (item.engagement?.likes || 0),
            0
        );
        const totalShares = contentData.reduce(
            (sum, item) => sum + (item.engagement?.shares || 0),
            0
        );
        const totalComments = contentData.reduce(
            (sum, item) => sum + (item.engagement?.comments || 0),
            0
        );

        const totalEngagement = totalLikes + totalShares + totalComments;
        const avgEngagementRate =
            totalViews > 0 ? (totalEngagement / totalViews) * 100 : 0;

        // Find top performer
        const topPerformer = contentData.reduce((top, item) => {
            const itemEngagement =
                (item.engagement?.likes || 0) +
                (item.engagement?.shares || 0) +
                (item.engagement?.comments || 0);
            const topEngagement =
                (top.engagement?.likes || 0) +
                (top.engagement?.shares || 0) +
                (top.engagement?.comments || 0);
            return itemEngagement > topEngagement ? item : top;
        }, contentData[0]);

        return {
            totalViews,
            totalLikes,
            totalShares,
            totalComments,
            avgEngagementRate,
            topPerformer,
        };
    };

    const metrics = calculateMetrics();

    // Prepare data for time-series chart
    const timeSeriesData = contentData
        .map((item) => ({
            date: item.publishDate
                ? new Date(item.publishDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                  })
                : "Unknown",
            views: item.engagement?.views || 0,
            engagement:
                (item.engagement?.likes || 0) +
                (item.engagement?.shares || 0) +
                (item.engagement?.comments || 0),
            title: item.title.substring(0, 20) + "...",
        }))
        .sort((a, b) => {
            const dateA = contentData.find((c) =>
                c.title.startsWith(a.title.replace("...", ""))
            )?.publishDate;
            const dateB = contentData.find((c) =>
                c.title.startsWith(b.title.replace("...", ""))
            )?.publishDate;
            return (
                new Date(dateA || 0).getTime() - new Date(dateB || 0).getTime()
            );
        });

    // Top performing content
    const topContent = [...contentData]
        .sort((a, b) => {
            const engagementA =
                (a.engagement?.views || 0) +
                (a.engagement?.likes || 0) * 2 +
                (a.engagement?.shares || 0) * 3;
            const engagementB =
                (b.engagement?.views || 0) +
                (b.engagement?.likes || 0) * 2 +
                (b.engagement?.shares || 0) * 3;
            return engagementB - engagementA;
        })
        .slice(0, 5);

    // Content type performance
    const contentTypeData = Object.entries(
        contentData.reduce(
            (acc, item) => {
                if (!acc[item.contentType]) {
                    acc[item.contentType] = {
                        views: 0,
                        engagement: 0,
                        count: 0,
                    };
                }
                acc[item.contentType].views += item.engagement?.views || 0;
                acc[item.contentType].engagement +=
                    (item.engagement?.likes || 0) +
                    (item.engagement?.shares || 0) +
                    (item.engagement?.comments || 0);
                acc[item.contentType].count += 1;
                return acc;
            },
            {} as Record<
                string,
                { views: number; engagement: number; count: number }
            >
        )
    ).map(([type, data]) => ({
        type,
        avgViews: Math.round(data.views / data.count),
        avgEngagement: Math.round(data.engagement / data.count),
    }));

    return (
        <div className="space-y-8">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Total Views"
                    value={metrics.totalViews.toLocaleString()}
                    icon={<Eye className="w-6 h-6 text-accent" />}
                />
                <MetricCard
                    title="Total Likes"
                    value={metrics.totalLikes.toLocaleString()}
                    icon={<Heart className="w-6 h-6 text-error" />}
                />
                <MetricCard
                    title="Total Shares"
                    value={metrics.totalShares.toLocaleString()}
                    icon={<Share2 className="w-6 h-6 text-success" />}
                />
                <MetricCard
                    title="Avg Engagement"
                    value={`${metrics.avgEngagementRate.toFixed(2)}%`}
                    icon={<TrendingUp className="w-6 h-6 text-info" />}
                />
            </div>

            {/* Performance Over Time */}
            <div className="bg-primary/5 p-6 rounded-xl">
                <h3 className="text-h4 font-semibold text-primary mb-4">
                    Performance Over Time
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={timeSeriesData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="date" stroke="#fff" />
                        <YAxis stroke="#fff" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#1a1a1a",
                                border: "1px solid #333",
                                borderRadius: "8px",
                            }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="views"
                            stroke="#3B82F6"
                            strokeWidth={2}
                            name="Views"
                        />
                        <Line
                            type="monotone"
                            dataKey="engagement"
                            stroke="#10B981"
                            strokeWidth={2}
                            name="Total Engagement"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Content Type Performance */}
            <div className="bg-primary/5 p-6 rounded-xl">
                <h3 className="text-h4 font-semibold text-primary mb-4">
                    Performance by Content Type
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={contentTypeData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="type" stroke="#fff" />
                        <YAxis stroke="#fff" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#1a1a1a",
                                border: "1px solid #333",
                                borderRadius: "8px",
                            }}
                        />
                        <Legend />
                        <Bar dataKey="avgViews" fill="#3B82F6" name="Avg Views" />
                        <Bar
                            dataKey="avgEngagement"
                            fill="#10B981"
                            name="Avg Engagement"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Top Performing Content */}
            <div className="bg-primary/5 p-6 rounded-xl">
                <h3 className="text-h4 font-semibold text-primary mb-4">
                    Top Performing Content
                </h3>
                <div className="space-y-4">
                    {topContent.map((item, index) => (
                        <div
                            key={item.id}
                            className="bg-secondary/50 p-4 rounded-lg hover:bg-secondary/70 transition-all"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-accent font-bold text-lg">
                                            #{index + 1}
                                        </span>
                                        <h4 className="text-primary font-medium">
                                            {item.title}
                                        </h4>
                                    </div>
                                    <div className="flex gap-4 text-sm text-primary/70">
                                        <span>
                                            {item.platform} • {item.contentType}
                                        </span>
                                        <span>
                                            {item.publishDate
                                                ? new Date(
                                                      item.publishDate
                                                  ).toLocaleDateString()
                                                : "N/A"}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-4 text-sm text-primary/80">
                                    <div className="flex items-center gap-1">
                                        <Eye className="w-4 h-4" />
                                        <span>
                                            {(
                                                item.engagement?.views || 0
                                            ).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Heart className="w-4 h-4" />
                                        <span>
                                            {(
                                                item.engagement?.likes || 0
                                            ).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Share2 className="w-4 h-4" />
                                        <span>
                                            {(
                                                item.engagement?.shares || 0
                                            ).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Metric Card Component
const MetricCard: FC<{
    title: string;
    value: string;
    icon: React.ReactNode;
}> = ({ title, value, icon }) => {
    return (
        <div className="bg-primary/5 p-6 rounded-xl hover:bg-primary/10 transition-all">
            <div className="flex items-center justify-between mb-2">
                <span className="text-primary/70 text-sm">{title}</span>
                {icon}
            </div>
            <div className="text-h3 font-bold text-primary">{value}</div>
        </div>
    );
};
