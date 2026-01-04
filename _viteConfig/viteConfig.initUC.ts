import { defineConfig } from 'vite';
export default defineConfig({
  build: {
    outDir: 'dist/initUC',
    lib: {
      entry: 'src/exports/initUC.ts',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {
      external: ['electron']
    }
  }
});