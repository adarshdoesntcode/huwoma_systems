/* global process */

import { rewrite } from "@vercel/functions";

export const config = {
  matcher: ["/api/:path*"],
};

export default function middleware(request) {
  const apiBaseUrl = process.env.VITE_API_BASE_URL;

  if (!apiBaseUrl) {
    return new Response("VITE_API_BASE_URL is not configured", {
      status: 500,
    });
  }

  const incomingUrl = new URL(request.url);
  const upstreamOrigin = new URL(apiBaseUrl).origin;
  const targetUrl = new URL(
    `${incomingUrl.pathname}${incomingUrl.search}`,
    upstreamOrigin,
  );

  return rewrite(targetUrl);
}
