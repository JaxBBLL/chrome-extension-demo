import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.json"; // Node 14 & 16
import autoImport from "unplugin-auto-import/vite";
// import manifest from "./manifest.json" assert { type: "json" }; // Node >=17

export default defineConfig({
  plugins: [
    autoImport({
      imports: [
        "vue",
        "vue-router",
        {
          vuex: ["useStore"],
        },
      ],
    }),
    vue(),
    crx({ manifest }),
  ],
  build: {
    rollupOptions: {
      input: {
        // 多页面入口配置
        index: "src/main.ts",
        option: "src/option.ts",
      },
    },
  },
});
