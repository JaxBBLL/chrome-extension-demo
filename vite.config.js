import { defineConfig } from "vite";
import copy from "rollup-plugin-copy";
import { resolve } from "path";

export default defineConfig(({ command, mode }) => {
  return {
    root: resolve(__dirname, "src"),
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
        input: ["./src/index.html", "./src/background.js", "./src/content.js"],
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
