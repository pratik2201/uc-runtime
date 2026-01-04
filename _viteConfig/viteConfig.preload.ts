import { defineConfig } from 'vite';
export default defineConfig({
  build: {
    outDir: 'dist/preload',
    lib: {
      entry: 'src/exports/preload.ts',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {

      external: [
        'electron',
        "node:path",
        "node:url",
        "node:fs",
        "node:crypto"
      ],
    },

  },
});