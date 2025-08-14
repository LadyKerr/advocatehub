import { type FC } from "react";

type CommandsProps = {
    headers: {
        title: string;
    }[];
    commands: {
        command: string;
        npm: string;
        yarn: string;
        description: string;
    }[];
};

export const Commands: FC<CommandsProps> = ({ commands, headers }) => {
    if (!commands.length) {
        return null;
    }

    return (
        <section className="my-20 px-4 bg-secondary">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-h2-md md:text-h2 text-primary text-center mb-16">
                    Commands
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-primary/10">
                                {headers.map((header, index) => (
                                    <th
                                        className="p-4 text-primary"
                                        key={index}
                                    >
                                        {header.title}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {commands.map((cmd) => (
                                <tr
                                    key={cmd.command}
                                    className="border-b border-primary/10"
                                >
                                    <td className="p-4 text-primary">
                                        {cmd.command}
                                    </td>
                                    <td className="p-4">
                                        <code className="bg-primary/10 px-2 py-1 rounded text-primary">
                                            {cmd.npm}
                                        </code>
                                    </td>
                                    <td className="p-4">
                                        <code className="bg-primary/10 px-2 py-1 rounded text-primary">
                                            {cmd.yarn}
                                        </code>
                                    </td>
                                    <td className="p-4 text-primary/80">
                                        {cmd.description}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};
