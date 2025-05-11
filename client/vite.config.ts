import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: '0.0.0.0',
        port: 3000,

        proxy: {
            '/ws': {
                target: 'ws://localhost:8005',
                ws: true,
                rewriteWsOrigin: true,
            },
        },
    },
});
