import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  
  plugins: [react()],
  optimizeDeps: {
    include: ["jwt-decode"],
  },
  server: {
    port: 3001, // default: 3000
    proxy: {
      target: 'https://techshop-vq9i.onrender.com',
    }
  },
  
});
