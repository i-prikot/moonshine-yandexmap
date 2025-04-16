import { defineConfig } from "vite";

export default defineConfig({
    build: {
        emptyOutDir: false,
        rollupOptions: {
            input: ["resources/js/app.js", "resources/css/style.css"],
            output: {
                entryFileNames: `app.js`,
                assetFileNames: (file) => {
                    let ext = file.name.split(".").pop();
                    if (ext === "css") {
                        return "style.css";
                    }

                    return "[name].[ext]";
                },
            },
        },
        outDir: "public",
    },
});
