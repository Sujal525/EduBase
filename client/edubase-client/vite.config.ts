import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// You can set NODE_OPTIONS globally in the environment or in package.json for better management
process.env.NODE_OPTIONS = '--max-old-space-size=512'; // Limit memory to 512MB

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0', // Expose the server to the network (useful for cloud environments)
    watch: {
      usePolling: true, // Optimize file watching, especially in certain environments like Render
    },
  },
  build: {
    chunkSizeWarningLimit: 500, // Increase the chunk size warning limit (in KB) for large files
  },
})
