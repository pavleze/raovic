import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  base: './',
  server: {
    port: 3000,
    watch: {
      // Windows drzi fajl zauzet dok se kopira, sto obara watcher (EBUSY).
      ignored: ["**/public/images/**"]
    }
  }
});
