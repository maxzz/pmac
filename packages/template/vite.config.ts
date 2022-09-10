import { defineConfig } from 'vite';

export default defineConfig({
    base: '',
    build: {
        polyfillModulePreload: false,
    },
    server: {
        port: 3000,
    }
});
