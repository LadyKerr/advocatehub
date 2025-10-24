import { type FC } from "react";
import { LoadingProvider, useLoading } from "../contexts/LoadingContext";
import { Features } from "../blocks/Features";
import { Structure } from "../blocks/Structure";
import { TechStack } from "../blocks/TechStack";

const LoadingControls: FC = () => {
    const { setComponentLoading, isComponentLoading, setGlobalLoading, isGlobalLoading } = useLoading();

    return (
        <div className="fixed bottom-4 right-4 bg-primary/10 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-primary/20 max-w-md z-50">
            <h3 className="text-h4 text-primary mb-4">Loading Controls</h3>
            
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <label className="text-primary/80 text-sm">Global Loading</label>
                    <button
                        onClick={() => setGlobalLoading(!isGlobalLoading)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isGlobalLoading 
                                ? 'bg-accent text-white' 
                                : 'bg-primary/10 text-primary hover:bg-primary/20'
                        }`}
                    >
                        {isGlobalLoading ? 'Stop' : 'Start'}
                    </button>
                </div>

                <div className="h-px bg-primary/20" />

                <div className="flex items-center justify-between">
                    <label className="text-primary/80 text-sm">Features</label>
                    <button
                        onClick={() => setComponentLoading('features', !isComponentLoading('features'))}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isComponentLoading('features')
                                ? 'bg-accent text-white'
                                : 'bg-primary/10 text-primary hover:bg-primary/20'
                        }`}
                    >
                        {isComponentLoading('features') ? 'Stop' : 'Start'}
                    </button>
                </div>

                <div className="flex items-center justify-between">
                    <label className="text-primary/80 text-sm">Structure</label>
                    <button
                        onClick={() => setComponentLoading('structure', !isComponentLoading('structure'))}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isComponentLoading('structure')
                                ? 'bg-accent text-white'
                                : 'bg-primary/10 text-primary hover:bg-primary/20'
                        }`}
                    >
                        {isComponentLoading('structure') ? 'Stop' : 'Start'}
                    </button>
                </div>

                <div className="flex items-center justify-between">
                    <label className="text-primary/80 text-sm">TechStack</label>
                    <button
                        onClick={() => setComponentLoading('techstack', !isComponentLoading('techstack'))}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isComponentLoading('techstack')
                                ? 'bg-accent text-white'
                                : 'bg-primary/10 text-primary hover:bg-primary/20'
                        }`}
                    >
                        {isComponentLoading('techstack') ? 'Stop' : 'Start'}
                    </button>
                </div>
            </div>

            <p className="text-primary/60 text-xs mt-4">
                Toggle loading states to see skeleton loaders with shimmer effects
            </p>
        </div>
    );
};

const DemoContent: FC = () => {
    return (
        <>
            <LoadingControls />
            
            <Features
                title="Features"
                description="Everything you need to build modern, SEO-friendly static websites"
                features={[
                    {
                        title: "Project Structure",
                        description: "Organized using a libs system for reusability and modular architecture.",
                        icon: "fileJson",
                    },
                    {
                        title: "Static Media",
                        description: "Self-hosted fonts and optimized images with TypeScript support.",
                        icon: "image",
                    },
                    {
                        title: "Modern Stack",
                        description: "Astro + React + TypeScript + Tailwind CSS.",
                        icon: "code",
                    },
                ]}
                loadingKey="features"
            />

            <Structure
                title="Project Structure"
                description="Organized using a libs system for better modularity and scalability"
                items={[
                    {
                        name: "src",
                        type: "folder",
                        items: [
                            {
                                name: "libs",
                                type: "folder",
                                description: "Reusable UI components and utilities",
                            },
                            {
                                name: "pages",
                                type: "folder",
                                description: "Application routes",
                            },
                        ],
                    },
                ]}
                loadingKey="structure"
            />

            <TechStack
                title="Tech Stack"
                description="Carefully selected technologies for the best developer experience"
                technologies={[
                    {
                        name: "React",
                        description: "Component-Based UI library",
                        link: "https://reactjs.org/",
                        benefits: [
                            "Component-driven development",
                            "Rich ecosystem of libraries",
                        ],
                    },
                    {
                        name: "Tailwind CSS",
                        description: "Utility-First CSS Framework",
                        link: "https://tailwindcss.com/",
                        benefits: [
                            "Rapid UI development",
                            "Consistent design system",
                        ],
                    },
                ]}
                loadingKey="techstack"
            />
        </>
    );
};

export const LoadingDemo: FC = () => {
    return (
        <LoadingProvider>
            <DemoContent />
        </LoadingProvider>
    );
};
