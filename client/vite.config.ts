import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue()],
    envDir: path.resolve(__dirname, 'src', 'shared', 'config'),
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@styles': path.resolve(__dirname, 'src', 'shared', 'styles'),
            '@pages': path.resolve(__dirname, 'src', 'pages'),
            '@ui': path.resolve(__dirname, 'src', 'shared', 'ui'),
            '@services': path.resolve(__dirname, 'src', 'shared', 'services'),
            '@models': path.resolve(__dirname, 'src', 'shared', 'models'),
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: '@use "@styles/variables.scss" as *;',
            },
        },
    },
});
