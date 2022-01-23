import { defineConfig } from "vite";
import copy from "rollup-plugin-copy";
import { resolve } from "path";

export default defineConfig(({ command, mode }) => {
  return {
    root: "src",
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    plugins: [
      copy({
        targets: [
          { src: "src/manifest.json", dest: "dist" },
          { src: "src/assets", dest: "dist" },
        ],
        hook: "writeBundle",
      }),
    ],
    build: {
      watch: mode == "dev" ? {} : false,
      rollupOptions: {
        input: ["index.html", "background.js", "content.js"],
        output: {
          chunkFileNames: "[name].[hash].js",
          assetFileNames: "[name].[hash].[ext]",
          entryFileNames: "[name].js",
          dir: "dist",
        },
      },
    },
  };
});
