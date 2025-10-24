import { type FC } from "react";

type SkeletonProps = {
    className?: string;
    variant?: "text" | "circular" | "rectangular";
    width?: string;
    height?: string;
};

export const Skeleton: FC<SkeletonProps> = ({
    className = "",
    variant = "rectangular",
    width,
    height,
}) => {
    const variantClasses = {
        text: "h-4 rounded",
        circular: "rounded-full",
        rectangular: "rounded",
    };

    const style: React.CSSProperties = {};
    if (width) style.width = width;
    if (height) style.height = height;

    return (
        <div
            className={`animate-shimmer bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 bg-[length:200%_100%] ${variantClasses[variant]} ${className}`}
            style={style}
            aria-busy="true"
            aria-live="polite"
            aria-label="Loading content"
        />
    );
};
