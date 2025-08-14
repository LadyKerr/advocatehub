import { type FC } from "react";
import { ArrowRight } from "lucide-react";

type HeroProps = {
    title: string;
    description: string;
};

export const Hero: FC<HeroProps> = ({ title, description }) => {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-secondary">
            <h1 className="text-h1-md md:text-h1 font-bold text-primary mb-6">
                {title}
            </h1>
            <p className="text-p-md md:text-p max-w-2xl text-primary/80 mb-8">
                {description}
            </p>
            <div className="flex gap-4">
                <a
                    href="#features"
                    className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-6 py-3 rounded-lg transition-all"
                >
                    Explore Features <ArrowRight size={20} />
                </a>
                <a
                    href="https://github.com/codexcodethemes/astro-starter"
                    className="flex items-center gap-2 bg-primary text-secondary px-6 py-3 rounded-lg hover:opacity-90 transition-all"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Get Started
                </a>
            </div>
        </div>
    );
};
