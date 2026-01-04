import { defineConfig } from 'vite';
export default defineConfig({
  build: {
    outDir: 'dist/nodeFn',
    lib: {
      entry: 'src/exports/nodeFn.ts',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {
      external: ['electron']
    }
  }
});