import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    port: 3000,
    watch: {
      // Windows drzi fajl zauzet dok se kopira, sto obara watcher (EBUSY).
      ignored: ["**/public/images/**"]
    }
  }
});
