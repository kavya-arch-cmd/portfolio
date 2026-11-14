import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // three.js alone is ~700 kB minified; it now loads separately and is cached on its own.
    chunkSizeWarningLimit: 800,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: 'react', test: /node_modules[\/](react|react-dom|scheduler)[\/]/, priority: 3 },
            { name: 'three', test: /node_modules[\/]three[\/]/, priority: 2 },
            { name: 'r3f', test: /node_modules[\/](@react-three|three-stdlib|camera-controls|zustand|suspend-react|its-fine)/, priority: 1 },
          ],
        },
      },
    },
  },
});
