// vite.config.ts
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

const rootDirectory = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const isOfflineBuild = mode === 'offline';

  return {
    plugins: [
      react(),
      tailwindcss(),
      ...(isOfflineBuild ? [viteSingleFile()] : []),
    ],
    resolve: {
      alias: {
        '@': rootDirectory,
      },
    },
    ...(isOfflineBuild
      ? {
          base: './',
          build: {
            outDir: 'dist-offline',
            emptyOutDir: true,
            cssCodeSplit: false,
            assetsInlineLimit: 100_000_000,
            rollupOptions: {
              output: { inlineDynamicImports: true },
            },
          },
        }
      : {}),
  };
});