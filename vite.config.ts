
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  // Use relative path for Capacitor builds
  base: process.env.NODE_ENV === 'production' && process.env.CAPACITOR_BUILD 
    ? './' 
    : process.env.NODE_ENV === 'production' 
    ? '/precise-price-print/' 
    : '/',
  
  server: {
    host: "::",
    port: 3000,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));