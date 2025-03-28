// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allows Railway to access the server
    port: process.env.PORT || 4173, // Uses Railway's assigned port or defaults to 4173
  },
  preview: {
    host: '0.0.0.0',
    port: process.env.PORT || 4173,
  }
})
