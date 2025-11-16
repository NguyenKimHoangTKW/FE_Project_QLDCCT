import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false,
    commonjsOptions: {
      include: [/html-docx-js/, /node_modules/],
      transformMixedEsModules: true,
    },
  },
  resolve: {
    alias: {
      tinymce: resolve(__dirname, "node_modules/tinymce"),
    },
  },
  optimizeDeps: {
    exclude: ['html-docx-js'],
    esbuildOptions: {
      target: 'es2020',
      supported: {
        'top-level-await': true,
      },
    },
  },
});
