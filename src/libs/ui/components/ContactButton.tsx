import { type FC } from "react";
import { Mail } from "lucide-react";

export const ContactButton: FC = () => {
    return (
        <a
            href={`http://codexcode.store/contact`}
            className="fixed bottom-8 right-8 bg-primary text-secondary p-4 rounded-full shadow-lg hover:scale-110 transition-transform"
            target="_blank"
            aria-label="Contact Us"
        >
            <Mail className="w-6 h-6" />
        </a>
    );
};
