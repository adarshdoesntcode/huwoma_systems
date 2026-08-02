/* global process */

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
    {
      source: "/api/:path*",
      destination: `${apiOrigin}/api/:path*`,
    },
    {
      source: "/parknwashbyhuwoma",
      destination: "/public.html",
    },
    {
      source: "/parknwashbyhuwoma/:path*",
      destination: "/public.html",
    },
    {
      source: "/simracingbyhuwoma",
      destination: "/public.html",
    },
    {
      source: "/simracingbyhuwoma/:path*",
      destination: "/public.html",
    },
    {
      source: "/garagebyhuwoma",
      destination: "/public.html",
    },
    {
      source: "/garagebyhuwoma/:path*",
      destination: "/public.html",
    },
    {
      source: "/(.*)",
      destination: "/index.html",
    }
  ],
};
