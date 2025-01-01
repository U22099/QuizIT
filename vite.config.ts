import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  base: "/QuizIT/",
  plugins: [react(), VitePWA({
    workbox: {
      maximumFileSizeToCacheInBytes: 10485760
    },
    registerType: 'autoUpdate',
    manifest: {
      name: 'QuizIT: Digital Exam Generator',
      short_name: 'QuizIT',
      description: 'An AI powered exam generator using sample question inputs and providing a simple digital examination environment with timer and ai calculated answers',
      background_color: 'black',
      display: 'standalone',
      start_url: '/',
      scope: '/QuizIT',
      orientation: 'portrait',
      theme_color: 'black',
      icons: [
        {
          src: "pwa-64x64.png",
          sizes: "64x64",
          type: "image/png"
		},
        {
          src: "pwa-192x192.png",
          sizes: "192x192",
          type: "image/png"
		},
        {
          src: "pwa-512x512.png",
          sizes: "512x512",
          type: "image/png"
  		},
        {
          src: "maskable-icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable"
  		}
	]
    }
  })],
});