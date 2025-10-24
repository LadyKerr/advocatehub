import { type FC, useState, useEffect } from "react";
import { Folder, File, ChevronRight } from "lucide-react";
import { Skeleton } from "../components/Skeleton";
import { useLoading } from "../contexts/LoadingContext";

type FileItem = {
    name: string;
    description?: string;
    type: "file" | "folder";
    items?: FileItem[];
};

type StructureProps = {
    items: FileItem[];
    title?: string;
    description?: string;
    isLoading?: boolean;
    loadingKey?: string;
};

const StructureItemSkeleton: FC<{ depth?: number }> = ({ depth = 0 }) => (
    <div className={`flex flex-col gap-2 ${depth > 0 ? "ml-6" : ""}`}>
        <div className="flex items-center gap-3">
            {depth > 0 && <Skeleton className="w-3.5 h-3.5" variant="rectangular" />}
            <Skeleton className="w-4 h-4" variant="rectangular" />
            <Skeleton className="h-4 w-32" variant="text" />
            <Skeleton className="h-3 w-48 hidden md:block" variant="text" />
        </div>
    </div>
);

export const Structure: FC<StructureProps> = ({
    items,
    title,
    description,
    isLoading: isLoadingProp,
    loadingKey = "structure",
}) => {
    const loadingContext = useLoading(loadingKey);
    const isLoading = isLoadingProp !== undefined ? isLoadingProp : loadingContext.isLoading;
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            const timer = setTimeout(() => setShowContent(true), 50);
            return () => clearTimeout(timer);
        } else {
            setShowContent(false);
        }
    }, [isLoading]);

    if (!isLoading && !items.length) {
        return null;
    }

    const renderItem = (item: FileItem, depth = 0) => {
        const Icon = item.type === "folder" ? Folder : File;

        return (
            <div
                key={item.name}
                className={`flex flex-col gap-2 ${depth > 0 ? "ml-6" : ""} transition-opacity duration-300 ${showContent ? 'opacity-100' : 'opacity-0'}`}
            >
                <div className="flex items-center gap-3 group">
                    {depth > 0 && (
                        <ChevronRight size={14} className="text-primary/40" />
                    )}
                    <Icon
                        size={18}
                        className={`${
                            item.type === "folder"
                                ? "text-blue-400"
                                : "text-primary/60"
                        }`}
                    />
                    <span className="text-primary font-mono">{item.name}</span>
                    {item.description && (
                        <span className="text-primary/60 text-sm hidden md:inline-block">
                            # {item.description}
                        </span>
                    )}
                </div>
                {item.items?.map((subItem) => renderItem(subItem, depth + 1))}
            </div>
        );
    };

    return (
        <section 
            className="my-20 px-4 bg-secondary"
            aria-busy={isLoading}
        >
            <div className="max-w-6xl mx-auto">
                {isLoading ? (
                    <>
                        <Skeleton className="h-10 w-64 mx-auto mb-4" variant="text" />
                        <Skeleton className="h-6 w-96 max-w-full mx-auto mb-16" variant="text" />
                    </>
                ) : (
                    <>
                        {title && (
                            <h2 className={`text-h2-md md:text-h2 text-primary text-center mb-4 transition-opacity duration-300 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
                                {title}
                            </h2>
                        )}
                        {description && (
                            <p className={`text-primary/80 text-center max-w-2xl mx-auto mb-16 transition-opacity duration-300 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
                                {description}
                            </p>
                        )}
                    </>
                )}
                <div className="bg-primary/5 rounded-xl p-8">
                    <div className="flex flex-col gap-4">
                        {isLoading ? (
                            <>
                                <StructureItemSkeleton />
                                <StructureItemSkeleton depth={1} />
                                <StructureItemSkeleton depth={1} />
                                <StructureItemSkeleton depth={2} />
                                <StructureItemSkeleton depth={2} />
                                <StructureItemSkeleton depth={1} />
                                <StructureItemSkeleton />
                                <StructureItemSkeleton depth={1} />
                            </>
                        ) : (
                            items.map((item) => renderItem(item))
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
