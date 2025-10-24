# 🚀 CODEXCODE ASTRO STARTER

## 📚 Changes

This Boilerplate will be updated with new features and improvements.

If you want us to change or add something, please contact us on our [Discord Server](https://discord.gg/kpYgj5cw)

Have fun!

## 📚 Overview

A modern, performance-driven starter template integrating **Astro** with **React**, designed for static site generation with dynamic UI components. This template ensures a seamless developer experience while optimizing for speed and **SEO**.

## 🎨 Tech Stack

-   [**Astro**](https://astro.build/) - Static Site Generator
-   [**React**](https://reactjs.org/) - Component-Based UI
-   [**Tailwind CSS**](https://tailwindcss.com/) - Utility-First Styling
-   [**Lucide React**](https://lucide.dev/) - SVG Icons
-   [**TypeScript**](https://www.typescriptlang.org/) - Type Safety & Enhanced DX

## 🗂️ Project Structure

To maintain clarity and scalability, we organize the project using a **libs system**. This ensures reusability and a modular architecture.

```
├── src/
│   ├── layouts/           # Base layouts such as the **MainLayout** and **SEO meta configurations**.
│   ├── libs/
│   │   ├── ui/             # All components, blocks, modules - whole structure of the reusable elements that you can use in your project.
│   ├── pages/             # Astro pages (each file maps to a route)
│   ├── static/            # All static assets - images, icons, fonts, etc.
├── public/                # Public assets (served as-is)
├── astro.config.mjs       # Astro configuration
├── tailwind.config.js     # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
```

### ⚡️ Why like this?

**Astro.build** is a modern front-end framework that allows you to build faster, optimized websites. It's compatible with React, which is a popular library for building user interfaces.

**Tailwind** -A utility-first approach ensures rapid UI development without writing excessive custom CSS.

## 📈 Performance Best Practices

-   Use **.WEBP format** for images to reduce file size.
-   Optimize assets with tools like [**TinyPNG**](https://tinypng.com/).
-   Self-host fonts instead of using Google Fonts to improve load times.
-   Keep the HTML structure **lightweight** to ensure fast rendering.

## 🎨 Static Media

-   Fonts - setup there you'r all fonts - you don't want to get link to google - this can slow down you'r page, but if you needed, you can delete it and use google tags

-   images - Images are setup with typescript, so this component is easy to use & when you import image there you don't need to worry about use import for every single image

```
  @example
  <Image src="logo" alt="logo" width="50px" height="50px" />
```

You can use your own icons or use Lucide React icons - its up to you

-   icons - Icons are SVG files that you can use in React components, import all you'r icons in static/index.tsx and use it with

```
  @example
  <Icon name="icon" />
```

## ⚡ Skeleton Loading System

This template includes a comprehensive skeleton loading system with shimmer effects for enhanced user experience during data loading.

### Features

-   **Shimmer Animation**: Smooth, eye-catching shimmer effects using Tailwind CSS
-   **Accessibility**: Full ARIA support (aria-busy, aria-live, aria-label)
-   **Smooth Transitions**: Fade-in effects when content loads
-   **Context-Based Control**: Global and granular loading state management
-   **Reusable Components**: Pre-built skeletons for Features, Structure, and TechStack components

### Quick Start

```tsx
// Using prop-based loading (no context required)
<Features isLoading={true} {...props} />

// Using context-based loading
import { LoadingProvider } from "@libs/ui/contexts/LoadingContext";

<LoadingProvider>
    <Features loadingKey="features" {...props} />
    <Structure loadingKey="structure" {...props} />
    <TechStack loadingKey="techstack" {...props} />
</LoadingProvider>
```

### Demo

Visit `/demo` route to see the interactive loading demo with controls to toggle loading states.

For detailed documentation, see [LOADING_SYSTEM.md](./LOADING_SYSTEM.md).

## 💻 Sitemap - robots - SEO ⚠️ IMPORTANT ⚠️

⚠️ **Search for** ⚠️ **siteUrl** & change website main link to load properly all preview images & ect

also you can check if there is any CHANGEME or YOUR META DESCRIPTION FOR SEO - if yes, then you want to change it

**Sitemap** is generated automatically from astro.config file.

**Astro.config.mjs** There you can find example usage of sitemap, we add comments with if statements for various scenario, so check it & use it as you like!

**Robots** - Also its generated automatically.

## 🏗️ Key Directories Explained

### `/src/layouts`

Houses base layouts such as the **MainLayout** and **SEO meta configurations**.

### `/src/ui`

All components, blocks, modules - whole structure of the reusable elements that you can use in your project.

### `/src/pages`

Astro pages that **automatically generate routes** without the need for additional configurations.

### `/src/libs/static`

All static assets - images, icons, fonts, etc.

also images and icons are setup with typescript (examples you can find in above section)

## 🧞 Commands

#### All commands are run from the root of the project, from a terminal:

| Command                   | npm Command               | yarn Command           | Action                                           |
| :------------------------ | :------------------------ | :--------------------- | :----------------------------------------------- |
| `npm install`             | `npm install`             | `yarn install`         | Installs dependencies                            |
| `npm run dev`             | `npm run dev`             | `yarn dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | `npm run build`           | `yarn build`           | Build your production site to `./dist/`          |
| `npm run preview`         | `npm run preview`         | `yarn preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | `npm run astro ...`       | `yarn astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | `npm run astro -- --help` | `yarn astro -- --help` | Get help using the Astro CLI                     |

## 📞🧞 Contact & Support

[@contact](https://www.codexcode.store/contact) - for any questions or support

also if you want to fast contact with us, you can use our [Discord Server](https://discord.gg/kpYgj5cw)

## 🧞 Authors

-   [@codexcode](https://www.codexcode.store)
