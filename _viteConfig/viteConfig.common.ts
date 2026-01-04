import { defineConfig } from 'vite';
import path from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// vite.config.ts
export default defineConfig({
  build: {
    ssr: true,
    target: "node18",
    outDir: 'dist/common',
    lib: {
      entry: 'src/exports/common.ts',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {
      input:  'src/exports/common.ts', // entry file
      output: {
        entryFileNames: 'index.js',   // 👈 force output name
        chunkFileNames: '[name].js',  // optional, for any small chunks
        manualChunks: undefined
      },
      external: [
        'electron',
        "node:path",
        "node:url",
        "node:fs",
        "node:crypto"
      ],
    }
  },
  optimizeDeps: {
    disabled: true
  },
  plugins: [
    viteStaticCopy({
      targets: [
        { src: 'src/assets/*', dest: '../assets' } // copy assets to dist
      ]
    })
  ]
});
 