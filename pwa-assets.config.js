import {
  defineConfig,
  minimal2023Preset as preset,
} from "@vite-pwa/assets-generator/config";

export const pwaAssetsConfig = defineConfig({
  headLinkOptions: {
    preset: "2023",
  },
  preset,
  images: [
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
});
