import type { FC, ReactElement } from "react";

/**
 * NOTE
 * add ?react to use SVG as React Component!!
 * @important
 */

import IconThemeDark from "./icon-theme-dark.svg?react";
import IconThemeLight from "./icon-theme-light.svg?react";

// add all icons here to have easier access to all icons
export const icons = {
    themeDark: IconThemeDark,
    themeLight: IconThemeLight,
};

export type IconName = React.ImgHTMLAttributes<HTMLElement> & {
    name: keyof typeof icons;
    alt: string;
};

/**
 * Icon is a component that renders an SVG with the specified icon name
 * @example
 * <Icon name="home" />
 */
export const Icon: FC<IconName> = ({ name }): ReactElement => {
    const IconComponent = icons[name];

    return <IconComponent />;
};
