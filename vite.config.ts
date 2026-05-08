import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // IMPORTANT: This must be your GitHub repository name
  // Example: if your URL is github.com/wbezzant/crossword-mvp, use '/crossword-mvp/'
  base: '/crossword-mvp/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        game: resolve(__dirname, 'game.html'),
      },
    },
  },        
});