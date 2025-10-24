import { type FC, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import type { ContentItem } from "../../types/content";

type ContentCalendarProps = {
    contentData: ContentItem[];
};

type ViewMode = "month" | "week" | "day";

export const ContentCalendar: FC<ContentCalendarProps> = ({ contentData }) => {
    const [viewMode, setViewMode] = useState<ViewMode>("month");
    const [currentDate, setCurrentDate] = useState(new Date());

    // Group content by date
    const groupContentByDate = () => {
        const grouped: Record<string, ContentItem[]> = {};

        contentData.forEach((item) => {
            if (item.publishDate) {
                const dateKey = item.publishDate.split("T")[0]; // Get YYYY-MM-DD
                if (!grouped[dateKey]) {
                    grouped[dateKey] = [];
                }
                grouped[dateKey].push(item);
            }
        });

        return grouped;
    };

    const contentByDate = groupContentByDate();

    // Calculate calendar grid for month view
    const getMonthCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days: (Date | null)[] = [];

        // Add empty cells for days before the first of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        // Add all days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }

        return days;
    };

    const monthDays = getMonthCalendar();

    // Navigation functions
    const navigateMonth = (direction: "prev" | "next") => {
        setCurrentDate((prev) => {
            const newDate = new Date(prev);
            if (direction === "prev") {
                newDate.setMonth(newDate.getMonth() - 1);
            } else {
                newDate.setMonth(newDate.getMonth() + 1);
            }
            return newDate;
        });
    };

    // Format date to YYYY-MM-DD
    const formatDateKey = (date: Date) => {
        return date.toISOString().split("T")[0];
    };

    // Get content for a specific date
    const getContentForDate = (date: Date) => {
        const dateKey = formatDateKey(date);
        return contentByDate[dateKey] || [];
    };

    // Calculate publishing patterns
    const calculatePatterns = () => {
        const totalDays = Object.keys(contentByDate).length;
        const totalContent = contentData.filter(
            (item) => item.publishDate
        ).length;
        const avgContentPerDay =
            totalDays > 0 ? (totalContent / totalDays).toFixed(1) : 0;

        // Find most active day
        const mostActiveDate = Object.entries(contentByDate).reduce(
            (max, [date, items]) => {
                return items.length > (contentByDate[max]?.length || 0)
                    ? date
                    : max;
            },
            Object.keys(contentByDate)[0]
        );

        return {
            totalPublishingDays: totalDays,
            avgContentPerDay,
            mostActiveDate,
            mostActiveCount: contentByDate[mostActiveDate]?.length || 0,
        };
    };

    const patterns = calculatePatterns();

    return (
        <div className="space-y-6">
            {/* Publishing Patterns Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-primary/5 p-4 rounded-lg">
                    <div className="text-primary/70 text-sm mb-1">
                        Publishing Days
                    </div>
                    <div className="text-h3 font-bold text-primary">
                        {patterns.totalPublishingDays}
                    </div>
                </div>
                <div className="bg-primary/5 p-4 rounded-lg">
                    <div className="text-primary/70 text-sm mb-1">
                        Avg Content/Day
                    </div>
                    <div className="text-h3 font-bold text-primary">
                        {patterns.avgContentPerDay}
                    </div>
                </div>
                <div className="bg-primary/5 p-4 rounded-lg">
                    <div className="text-primary/70 text-sm mb-1">
                        Most Active Day
                    </div>
                    <div className="text-h3 font-bold text-primary">
                        {patterns.mostActiveDate
                            ? new Date(
                                  patterns.mostActiveDate
                              ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                              })
                            : "N/A"}
                    </div>
                </div>
                <div className="bg-primary/5 p-4 rounded-lg">
                    <div className="text-primary/70 text-sm mb-1">
                        Content on That Day
                    </div>
                    <div className="text-h3 font-bold text-primary">
                        {patterns.mostActiveCount}
                    </div>
                </div>
            </div>

            {/* Calendar View */}
            <div className="bg-primary/5 p-6 rounded-xl">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-h4 font-semibold text-primary">
                        Content Calendar
                    </h3>
                    <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setViewMode("month")}
                                className={`px-3 py-1 rounded ${
                                    viewMode === "month"
                                        ? "bg-accent text-primary"
                                        : "bg-primary/10 text-primary/70"
                                } transition-all`}
                            >
                                Month
                            </button>
                            <button
                                onClick={() => setViewMode("week")}
                                className={`px-3 py-1 rounded ${
                                    viewMode === "week"
                                        ? "bg-accent text-primary"
                                        : "bg-primary/10 text-primary/70"
                                } transition-all`}
                                disabled
                            >
                                Week
                            </button>
                            <button
                                onClick={() => setViewMode("day")}
                                className={`px-3 py-1 rounded ${
                                    viewMode === "day"
                                        ? "bg-accent text-primary"
                                        : "bg-primary/10 text-primary/70"
                                } transition-all`}
                                disabled
                            >
                                Day
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => navigateMonth("prev")}
                                className="p-2 bg-primary/10 hover:bg-primary/20 rounded transition-all"
                            >
                                <ChevronLeft className="w-5 h-5 text-primary" />
                            </button>
                            <span className="text-primary font-medium min-w-[150px] text-center">
                                {currentDate.toLocaleDateString("en-US", {
                                    month: "long",
                                    year: "numeric",
                                })}
                            </span>
                            <button
                                onClick={() => navigateMonth("next")}
                                className="p-2 bg-primary/10 hover:bg-primary/20 rounded transition-all"
                            >
                                <ChevronRight className="w-5 h-5 text-primary" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                    {/* Day headers */}
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                        (day) => (
                            <div
                                key={day}
                                className="text-center text-primary/70 text-sm font-medium py-2"
                            >
                                {day}
                            </div>
                        )
                    )}

                    {/* Calendar days */}
                    {monthDays.map((date, index) => {
                        if (!date) {
                            return (
                                <div
                                    key={`empty-${index}`}
                                    className="aspect-square bg-primary/5 rounded-lg"
                                />
                            );
                        }

                        const content = getContentForDate(date);
                        const isToday =
                            date.toDateString() === new Date().toDateString();

                        return (
                            <div
                                key={index}
                                className={`aspect-square p-2 rounded-lg ${
                                    isToday
                                        ? "bg-accent/20 border-2 border-accent"
                                        : "bg-primary/5 hover:bg-primary/10"
                                } transition-all cursor-pointer`}
                            >
                                <div className="h-full flex flex-col">
                                    <div
                                        className={`text-sm ${
                                            isToday
                                                ? "font-bold text-accent"
                                                : "text-primary/70"
                                        }`}
                                    >
                                        {date.getDate()}
                                    </div>
                                    {content.length > 0 && (
                                        <div className="mt-1 flex-1 flex flex-col gap-1">
                                            {content
                                                .slice(0, 2)
                                                .map((item, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="text-xs bg-accent/30 text-primary px-1 py-0.5 rounded truncate"
                                                        title={item.title}
                                                    >
                                                        {item.platform}
                                                    </div>
                                                ))}
                                            {content.length > 2 && (
                                                <div className="text-xs text-primary/70">
                                                    +{content.length - 2} more
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Legend */}
                <div className="mt-6 flex items-center gap-4 text-sm text-primary/70">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-accent/20 border-2 border-accent rounded" />
                        <span>Today</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-accent/30 rounded" />
                        <span>Has Content</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
