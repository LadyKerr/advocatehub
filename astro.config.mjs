import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import CompressionPlugin from "vite-plugin-compression";
import sitemap from "@astrojs/sitemap";
import svgr from "vite-plugin-svgr";
import tailwind from "@astrojs/tailwind";

export const siteUrl = "http://localhost:4321";

const date = new Date().toISOString();
// https://astro.build/config
export default defineConfig({
    site: siteUrl + "/",

    integrations: [
        tailwind(),
        react(),
        svgr(),
        sitemap({
            serialize(item) {
                // Default values for pages
                item.priority = siteUrl + "/" === item.url ? 1.0 : 0.9;
                item.changefreq = "weekly";
                item.lastmod = date;

                // if you want to exclude a page from the sitemap, do it here
                // if (/exclude-from-sitemap/.test(item.url)) {
                //     return undefined;
                // }

                // if any page needs a different priority, changefreq, or lastmod, uncomment the following lines and adjust as needed
                // if (/test-sitemap/.test(item.url)) {
                //     item.changefreq = "daily";
                //     item.lastmod = date;
                //     item.priority = 0.9;
                // }

                // if you want to change priority of all subpages like "/posts/*", you can use:
                // if (/\/posts\//.test(item.url)) {
                //     item.priority = 0.7;
                // }
                return item;
            },
        }),
    ],
    renderers: ["@astrojs/renderer-react"],
    prerender: true,
    vite: {
        plugins: [CompressionPlugin(), svgr()],
    },
    buildOptions: {
        minify: true,
    },
});
