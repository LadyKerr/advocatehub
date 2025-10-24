import { type FC, useState, useEffect } from "react";
import {
    FileJson,
    Image,
    Code,
    type LucideIcon,
    Palette,
    Zap,
} from "lucide-react";
import { Skeleton } from "../components/Skeleton";

type Feature = {
    title: string;
    description: string;
    icon: "fileJson" | "image" | "code" | "palette" | "zap";
};

type FeaturesProps = {
    title: string;
    description: string;
    features: Feature[];
    isLoading?: boolean;
};

const FeatureSkeleton: FC = () => (
    <div className="p-8 bg-primary/5 rounded-xl">
        <Skeleton className="w-12 h-12 mb-4" variant="rectangular" />
        <Skeleton className="h-6 w-3/4 mb-2" variant="text" />
        <Skeleton className="h-4 w-full mb-1" variant="text" />
        <Skeleton className="h-4 w-5/6" variant="text" />
    </div>
);

export const Features: FC<FeaturesProps> = ({
    title,
    description,
    features,
    isLoading = false,
}) => {
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            const timer = setTimeout(() => setShowContent(true), 50);
            return () => clearTimeout(timer);
        } else {
            setShowContent(false);
        }
    }, [isLoading]);

    if (!isLoading && !features.length) {
        return null;
    }

    return (
        <section 
            id="features" 
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {isLoading ? (
                        <>
                            <FeatureSkeleton />
                            <FeatureSkeleton />
                            <FeatureSkeleton />
                            <FeatureSkeleton />
                            <FeatureSkeleton />
                            <FeatureSkeleton />
                        </>
                    ) : (
                        features.map((feature, index) => {
                            let IconComponent: LucideIcon | undefined;
                            switch (feature.icon) {
                                case "fileJson":
                                    IconComponent = FileJson;
                                    break;
                                case "image":
                                    IconComponent = Image;
                                    break;
                                case "code":
                                    IconComponent = Code;
                                    break;
                                case "palette":
                                    IconComponent = Palette;
                                    break;
                                case "zap":
                                    IconComponent = Zap;
                                    break;
                            }
                            return (
                                <div
                                    className={`p-8 bg-primary/5 rounded-xl hover:bg-primary/10 transition-all duration-300 ${showContent ? 'opacity-100' : 'opacity-0'}`}
                                    key={index}
                                >
                                    <IconComponent className="w-12 h-12 text-primary mb-4" />
                                    <h3 className="text-h4 font-semibold text-primary mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-primary/80">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </section>
    );
};
