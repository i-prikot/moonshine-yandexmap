import { defineConfig } from "vite";

export default defineConfig({
    publicDir: false,
    build: {
        emptyOutDir: false,
        rollupOptions: {
            input: {
                app: "resources/js/app.js",
                style: "resources/css/style.css",
            },
            output: {
                entryFileNames: `[name].js`,
                assetFileNames: `[name].[ext]`,
            },
        },
        outDir: "public",
    },
});
