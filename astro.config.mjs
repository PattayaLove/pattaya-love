// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://www.pattaya.love',

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    sitemap({
      // /shirts/ is a noindex pre-launch interest test; keep it out of the sitemap.
      filter: (page) => !new URL(page).pathname.startsWith('/shirts/'),
    }),
  ],
  adapter: vercel({
    imageService: true,
    webAnalytics: { enabled: true },
    speedInsights: { enabled: true },
  }),
  image: {
    domains: [],
    remotePatterns: [],
  },
});