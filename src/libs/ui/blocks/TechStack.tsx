import { type FC } from "react";
import { Zap } from "lucide-react";

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
};

export const TechStack: FC<TechStackProps> = ({
    technologies,
    title,
    description,
}) => {
    if (!technologies.length) {
        return null;
    }

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
                        Carefully selected technologies for the best developer
                        {description}
                    </p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {technologies.map((tech) => (
                        <div
                            key={tech.name}
                            className="bg-primary/5 rounded-xl p-8 hover:bg-primary/10 transition-all"
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
                    ))}
                </div>
            </div>
        </section>
    );
};
