import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: '0.0.0.0',
        port: 3000,

        proxy: {
            '/ws/earth': {
                target: 'ws://localhost:8005',
                ws: true,
                rewriteWsOrigin: true,
            },
            '/ws/mars': {
                target: 'ws://localhost:8011',
                ws: true,
                rewriteWsOrigin: true,
            },
        },
    },
});
