import { type FC } from "react";
import { Folder, File, ChevronRight } from "lucide-react";

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
};

export const Structure: FC<StructureProps> = ({
    items,
    title,
    description,
}) => {
    if (!items.length) {
        return null;
    }

    const renderItem = (item: FileItem, depth = 0) => {
        const Icon = item.type === "folder" ? Folder : File;

        return (
            <div
                key={item.name}
                className={`flex flex-col gap-2 ${depth > 0 ? "ml-6" : ""}`}
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
        <section className="my-20 px-4 bg-secondary">
            <div className="max-w-6xl mx-auto">
                {title && (
                    <h2 className="text-h2-md md:text-h2 text-primary text-center mb-4">
                        {title}
                    </h2>
                )}
                {description && (
                    <p className="text-primary/80 text-center max-w-2xl mx-auto mb-16">
                        {description}
                    </p>
                )}
                <div className="bg-primary/5 rounded-xl p-8">
                    <div className="flex flex-col gap-4">
                        {items.map((item) => renderItem(item))}
                    </div>
                </div>
            </div>
        </section>
    );
};
