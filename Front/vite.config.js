import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { steamAuthPlugin } from './steamAuthPlugin.js'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        steamAuthPlugin(),
    ]
});
