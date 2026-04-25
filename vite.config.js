import path from "path";
import { fileURLToPath } from "url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_APP_ROUTE_PREFIXES = [
  "/parknwashbyhuwoma",
  "/simracingbyhuwoma",
  "/garagebyhuwoma",
];

const shouldRewriteToPublicApp = (url = "") => {
  const pathname = url.split("?")[0];

  if (
    !pathname ||
    pathname.startsWith("/@") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/assets/") ||
    pathname.startsWith("/src/") ||
    pathname.includes(".")
  ) {
    return false;
  }

  return PUBLIC_APP_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
};

const publicAppRouteRewritePlugin = {
  name: "public-app-route-rewrite",
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      if (shouldRewriteToPublicApp(req.url || "")) {
        req.url = "/public.html";
      }
      next();
    });
  },
  configurePreviewServer(server) {
    server.middlewares.use((req, _res, next) => {
      if (shouldRewriteToPublicApp(req.url || "")) {
        req.url = "/public.html";
      }
      next();
    });
  },
};

export default defineConfig({
  plugins: [
    publicAppRouteRewritePlugin,
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "icons/icon-48x48.png",
        "icons/icon-72x72.png",
        "icons/icon-96x96.png",
        "icons/icon-128x128.png",
        "icons/icon-144x144.png",
        "icons/icon-152x152.png",
        "icons/icon-192x192.png",
        "icons/icon-256x256.png",
        "icons/icon-384x384.png",
        "icons/icon-512x512.png",
        "splash_screens/*",
      ],
      manifest: {
        name: "Huwoma Systems",
        short_name: "Huwoma",
        icons: [
          {
            src: "icons/icon-48x48.png",
            sizes: "48x48",
            type: "image/png",
          },
          {
            src: "icons/icon-72x72.png",
            sizes: "72x72",
            type: "image/png",
          },
          {
            src: "icons/icon-96x96.png",
            sizes: "96x96",
            type: "image/png",
          },
          {
            src: "icons/icon-128x128.png",
            sizes: "128x128",
            type: "image/png",
          },
          {
            src: "icons/icon-144x144.png",
            sizes: "144x144",
            type: "image/png",
          },
          {
            src: "icons/icon-152x152.png",
            sizes: "152x152",
            type: "image/png",
          },
          {
            src: "icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons/icon-256x256.png",
            sizes: "256x256",
            type: "image/png",
          },
          {
            src: "icons/icon-384x384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        start_url: "/",
        display: "standalone",
        background_color: "#F8FAFC",
        theme_color: "#ffffff",
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10 MB
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        public: path.resolve(__dirname, "public.html"),
      },
    },
  },
});
