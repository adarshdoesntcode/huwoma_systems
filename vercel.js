/* global process */

import { routes } from "@vercel/config/v1";

const apiBaseUrl = process.env.VITE_API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error("VITE_API_BASE_URL must be set for Vercel deployments.");
}

const apiOrigin = new URL(apiBaseUrl).origin;

export const config = {
  headers: [
    {
      source: "/sw.js",
      headers: [
        {
          key: "Cache-Control",
          value: "no-cache, no-store, must-revalidate",
        }
      ],
    },
    {
      source: "/manifest.webmanifest",
      headers: [
        {
          key: "Cache-Control",
          value: "no-cache, no-store, must-revalidate",
        }
      ],
    }
  ],
  rewrites: [
    routes.rewrite("/api/:path*", `${apiOrigin}/api/:path*`),
    routes.rewrite("/parknwashbyhuwoma", "/public.html"),
    routes.rewrite("/parknwashbyhuwoma/:path*", "/public.html"),
    routes.rewrite("/simracingbyhuwoma", "/public.html"),
    routes.rewrite("/simracingbyhuwoma/:path*", "/public.html"),
    routes.rewrite("/garagebyhuwoma", "/public.html"),
    routes.rewrite("/garagebyhuwoma/:path*", "/public.html"),
    routes.rewrite("/(.*)", "/index.html"),
  ],
};
