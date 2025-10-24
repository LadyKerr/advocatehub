import { type FC, useState, useEffect } from "react";
import { Zap } from "lucide-react";
import { Skeleton } from "../components/Skeleton";
import { useLoading } from "../contexts/LoadingContext";

type TechItem = {
    name: string;
    description: string;
    link: string;
    benefits: string[];
};

type TechStackProps = {
    technologies: TechItem[];
    title?: string;
    description?: string;
    isLoading?: boolean;
    loadingKey?: string;
};

const TechStackSkeleton: FC = () => (
    <div className="bg-primary/5 rounded-xl p-8">
        <div className="flex items-center gap-3 mb-4">
            <Skeleton className="h-6 w-32" variant="text" />
        </div>
        <Skeleton className="h-4 w-full mb-4" variant="text" />
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <Skeleton className="w-1.5 h-1.5 rounded-full" variant="circular" />
                <Skeleton className="h-3 w-3/4" variant="text" />
            </div>
            <div className="flex items-center gap-2">
                <Skeleton className="w-1.5 h-1.5 rounded-full" variant="circular" />
                <Skeleton className="h-3 w-2/3" variant="text" />
            </div>
            <div className="flex items-center gap-2">
                <Skeleton className="w-1.5 h-1.5 rounded-full" variant="circular" />
                <Skeleton className="h-3 w-3/4" variant="text" />
            </div>
            <div className="flex items-center gap-2">
                <Skeleton className="w-1.5 h-1.5 rounded-full" variant="circular" />
                <Skeleton className="h-3 w-1/2" variant="text" />
            </div>
        </div>
    </div>
);

export const TechStack: FC<TechStackProps> = ({
    technologies,
    title,
    description,
    isLoading: isLoadingProp,
    loadingKey = "techstack",
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

    if (!isLoading && !technologies.length) {
        return null;
    }

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
                                Carefully selected technologies for the best developer
                                {description}
                            </p>
                        )}
                    </>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {isLoading ? (
                        <>
                            <TechStackSkeleton />
                            <TechStackSkeleton />
                            <TechStackSkeleton />
                            <TechStackSkeleton />
                            <TechStackSkeleton />
                            <TechStackSkeleton />
                        </>
                    ) : (
                        technologies.map((tech) => (
                            <div
                                key={tech.name}
                                className={`bg-primary/5 rounded-xl p-8 hover:bg-primary/10 transition-all duration-300 ${showContent ? 'opacity-100' : 'opacity-0'}`}
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <a
                                        href={tech.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-h4 font-semibold text-primary hover:text-primary/80 transition-colors"
                                    >
                                        {tech.name}
                                    </a>
                                </div>
                                <p className="text-primary/80 mb-4">
                                    {tech.description}
                                </p>
                                <ul className="space-y-2">
                                    {tech.benefits.map((benefit) => (
                                        <li
                                            key={benefit}
                                            className="text-primary/60 text-sm flex items-center gap-2"
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};
