import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { singleFile } from 'vite-plugin-singlefile';

const rootDirectory = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ command }) => {
  const isOfflineBuild = command === 'build' && process.env.OFFLINE_BUILD;
  
  return {
    plugins: [react(), tailwindcss(), ...(isOfflineBuild ? [singleFile()] : [])],
    resolve: {
      alias: {
        '@': rootDirectory,
      },
    },
  };
});