import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const THIRTY_DAYS_IN_SECONDS = 60 * 60 * 24 * 30;

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "apple-touch-icon.png"],

      manifest: {
        name: "Pokedex",
        short_name: "Pokedex",
        description:
          "Pokedex para buscar un Pokémon por nombre o número y ver su ilustración y estadísticas base.",
        lang: "es",
        display: "standalone",
        theme_color: "#0e1511",
        background_color: "#0e1511",
        icons: [
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
          {
            src: "pwa-maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },

      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,woff2}"],

        runtimeCaching: [
          {
            // Datos de cada Pokémon: se sirve la copia guardada y se refresca en segundo plano.
            urlPattern: /^https:\/\/pokeapi\.co\/api\/v2\/pokemon\//,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "pokeapi-data",
              cacheableResponse: { statuses: [200] },
              expiration: { maxEntries: 200, maxAgeSeconds: THIRTY_DAYS_IN_SECONDS },
            },
          },
          {
            // Ilustraciones y sprites: no cambian, se sirven siempre desde la caché.
            urlPattern: /^https:\/\/raw\.githubusercontent\.com\/PokeAPI\/sprites\//,
            handler: "CacheFirst",
            options: {
              cacheName: "pokemon-sprites",
              cacheableResponse: { statuses: [200] },
              expiration: { maxEntries: 200, maxAgeSeconds: THIRTY_DAYS_IN_SECONDS },
            },
          },
        ],
      },
    }),
  ],

  server: {
    port: 3000,
    open: true,
  },

  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
  },
});
