import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

const root = path.dirname(fileURLToPath(import.meta.url));

/** The build is one self-contained file, so give it a friendly name. */
function nameSingleFile(): Plugin {
  return {
    name: 'tessellate-name-single-file',
    apply: 'build',
    closeBundle() {
      const built = path.join(root, 'package', 'index.html');
      const target = path.join(root, 'package', 'Tessellate.html');
      if (fs.existsSync(built)) fs.renameSync(built, target);
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile(), nameSingleFile()],
  resolve: {
    alias: {
      '@': root,
    },
  },
  base: './',
  build: {
    outDir: 'package',
    emptyOutDir: true,
    cssCodeSplit: false,
    assetsInlineLimit: 100_000_000,
    rollupOptions: {
      output: { inlineDynamicImports: true },
    },
  },
});
