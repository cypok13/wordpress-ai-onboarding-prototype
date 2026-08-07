import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Force a single copy of React so @wordpress/components can't pull its own.
  resolve: { dedupe: ['react', 'react-dom'] },
})
