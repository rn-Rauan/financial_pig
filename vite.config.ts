import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// PWA: auto-updating service worker that precaches the app shell. The web app
// manifest is maintained as a static file (public/manifest.webmanifest) and
// linked from index.html, so the plugin uses manifest: false. navigateFallback
// serves index.html for client-side routes so deep links work offline (SPA).
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: false,
      includeAssets: [
        "icons/icon.svg",
        "icons/icon-180.png",
        "icons/icon-192.png",
        "icons/icon-512.png",
      ],
      workbox: {
        navigateFallback: "index.html",
        // Supabase calls are cross-origin POST/GET; never serve the SPA shell
        // for the API path if it is ever same-origin proxied.
        navigateFallbackDenylist: [/^\/rest\//, /^\/auth\//],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: true,
    port: 5173,
  },
});
