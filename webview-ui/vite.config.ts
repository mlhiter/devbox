import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    hmr: {
      host: 'localhost',
      protocol: 'ws',
    },
    cors: {
      origin: '*',
      methods: '*',
      allowedHeaders: '*',
    },
  },
  define: {
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.IS_DEV ? 'development' : 'production'),
      IS_DEV: JSON.stringify(process.env.IS_DEV),
    },
  },
})
