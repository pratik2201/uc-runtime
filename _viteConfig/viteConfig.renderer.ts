import { defineConfig } from 'vite';
export default defineConfig({
  build: {
    outDir: 'dist/renderer',
    lib: {
      entry: 'src/exports/renderer.ts',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {
      external: ['electron']
    }
  }
});