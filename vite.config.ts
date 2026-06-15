import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/" : "/",
  server: {
    host: "127.0.0.1",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  build: {
    sourcemap: false,
    minify: "esbuild",
    target: "es2020",
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('/node_modules/react/') || id.includes('/node_modules/react-dom/') || id.includes('/node_modules/react-router-dom/')) {
              return 'react-vendor';
            }
            if (id.includes('/node_modules/@radix-ui/')) {
              return 'radix-vendor';
            }
            if (id.includes('/node_modules/framer-motion/')) {
              return 'framer-motion';
            }
            if (id.includes('/node_modules/@sentry/')) {
              return 'sentry-vendor';
            }
            if (id.includes('/node_modules/@supabase/')) {
              return 'supabase-vendor';
            }
            return 'vendor';
          }
        }
      },
    },
  },
  plugins: [
    react(), 
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 80 },
      jpg: { quality: 80 },
      webp: { quality: 80 },
      avif: { quality: 70 },
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
