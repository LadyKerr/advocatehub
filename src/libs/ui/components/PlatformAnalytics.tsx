import { type FC } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import type { ContentItem, PlatformStats, Platform } from "../../types/content";

type PlatformAnalyticsProps = {
    contentData: ContentItem[];
};

const PLATFORM_COLORS: Record<Platform, string> = {
    YouTube: "#FF0000",
    LinkedIn: "#0A66C2",
    GitHub: "#6e5494",
    Twitter: "#1DA1F2",
    Blog: "#10B981",
    Other: "#6B7280",
};

export const PlatformAnalytics: FC<PlatformAnalyticsProps> = ({
    contentData,
}) => {
    // Calculate platform statistics
    const calculatePlatformStats = (): PlatformStats[] => {
        const platformMap = contentData.reduce(
            (acc, item) => {
                if (!acc[item.platform]) {
                    acc[item.platform] = {
                        platform: item.platform,
                        totalContent: 0,
                        totalViews: 0,
                        totalEngagement: 0,
                        contentTypes: {} as Record<string, number>,
                    };
                }

                acc[item.platform].totalContent += 1;
                acc[item.platform].totalViews += item.engagement?.views || 0;
                acc[item.platform].totalEngagement +=
                    (item.engagement?.likes || 0) +
                    (item.engagement?.shares || 0) +
                    (item.engagement?.comments || 0);

                // Track content types
                if (!acc[item.platform].contentTypes[item.contentType]) {
                    acc[item.platform].contentTypes[item.contentType] = 0;
                }
                acc[item.platform].contentTypes[item.contentType] += 1;

                return acc;
            },
            {} as Record<
                string,
                {
                    platform: Platform;
                    totalContent: number;
                    totalViews: number;
                    totalEngagement: number;
                    contentTypes: Record<string, number>;
                }
            >
        );

        return Object.values(platformMap).map((stats) => {
            const avgEngagementRate =
                stats.totalViews > 0
                    ? (stats.totalEngagement / stats.totalViews) * 100
                    : 0;

            // Find top content type
            const topContentType = Object.entries(stats.contentTypes).reduce(
                (top, [type, count]) => {
                    return count > (stats.contentTypes[top] || 0) ? type : top;
                },
                Object.keys(stats.contentTypes)[0]
            );

            return {
                platform: stats.platform,
                totalContent: stats.totalContent,
                totalViews: stats.totalViews,
                totalEngagement: stats.totalEngagement,
                avgEngagementRate,
                topContentType: topContentType as any,
            };
        });
    };

    const platformStats = calculatePlatformStats();

    // Data for pie charts
    const contentDistribution = platformStats.map((stat) => ({
        name: stat.platform,
        value: stat.totalContent,
    }));

    const viewsDistribution = platformStats.map((stat) => ({
        name: stat.platform,
        value: stat.totalViews,
    }));

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Content Distribution */}
                <div className="bg-primary/5 p-6 rounded-xl">
                    <h3 className="text-h4 font-semibold text-primary mb-4">
                        Content Distribution by Platform
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={contentDistribution}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) =>
                                    `${name}: ${(percent * 100).toFixed(0)}%`
                                }
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {contentDistribution.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={
                                            PLATFORM_COLORS[
                                                entry.name as Platform
                                            ]
                                        }
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#1a1a1a",
                                    border: "1px solid #333",
                                    borderRadius: "8px",
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Views Distribution */}
                <div className="bg-primary/5 p-6 rounded-xl">
                    <h3 className="text-h4 font-semibold text-primary mb-4">
                        Views Distribution by Platform
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={viewsDistribution}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) =>
                                    `${name}: ${(percent * 100).toFixed(0)}%`
                                }
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {viewsDistribution.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={
                                            PLATFORM_COLORS[
                                                entry.name as Platform
                                            ]
                                        }
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#1a1a1a",
                                    border: "1px solid #333",
                                    borderRadius: "8px",
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Platform Details Table */}
            <div className="bg-primary/5 p-6 rounded-xl">
                <h3 className="text-h4 font-semibold text-primary mb-4">
                    Platform Performance Details
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-primary/20">
                                <th className="text-left py-3 px-4 text-primary/70 font-medium">
                                    Platform
                                </th>
                                <th className="text-right py-3 px-4 text-primary/70 font-medium">
                                    Content Count
                                </th>
                                <th className="text-right py-3 px-4 text-primary/70 font-medium">
                                    Total Views
                                </th>
                                <th className="text-right py-3 px-4 text-primary/70 font-medium">
                                    Engagement
                                </th>
                                <th className="text-right py-3 px-4 text-primary/70 font-medium">
                                    Avg Engagement Rate
                                </th>
                                <th className="text-left py-3 px-4 text-primary/70 font-medium">
                                    Top Content Type
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {platformStats.map((stat) => (
                                <tr
                                    key={stat.platform}
                                    className="border-b border-primary/10 hover:bg-primary/5 transition-colors"
                                >
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        PLATFORM_COLORS[
                                                            stat.platform
                                                        ],
                                                }}
                                            />
                                            <span className="text-primary font-medium">
                                                {stat.platform}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="text-right py-3 px-4 text-primary">
                                        {stat.totalContent}
                                    </td>
                                    <td className="text-right py-3 px-4 text-primary">
                                        {stat.totalViews.toLocaleString()}
                                    </td>
                                    <td className="text-right py-3 px-4 text-primary">
                                        {stat.totalEngagement.toLocaleString()}
                                    </td>
                                    <td className="text-right py-3 px-4 text-primary">
                                        {stat.avgEngagementRate.toFixed(2)}%
                                    </td>
                                    <td className="py-3 px-4 text-primary">
                                        {stat.topContentType}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
