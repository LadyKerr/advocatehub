import { type FC } from "react";
import {
    FileJson,
    Image,
    Code,
    type LucideIcon,
    Palette,
    Zap,
} from "lucide-react";

type Feature = {
    title: string;
    description: string;
    icon: "fileJson" | "image" | "code" | "palette" | "zap";
};

type FeaturesProps = {
    title: string;
    description: string;
    features: Feature[];
};

export const Features: FC<FeaturesProps> = ({
    title,
    description,
    features,
}) => {
    if (!features.length) {
        return null;
    }

    return (
        <section id="features" className="my-20 px-4 bg-secondary">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => {
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
                                className="p-8 bg-primary/5 rounded-xl hover:bg-primary/10 transition-all"
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
                    })}
                </div>
            </div>
        </section>
    );
};
