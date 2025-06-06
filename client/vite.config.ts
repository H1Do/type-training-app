import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';
import path from 'path';

export default defineConfig({
    plugins: [vue(), svgLoader()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    envDir: path.resolve(__dirname, 'src', 'shared', 'config'),

    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/shared/config/vitest.setup.ts'],
        coverage: {
            reporter: ['text', 'json', 'html'],
            reportsDirectory: 'coverage',
            exclude: [
                'node_modules/',
                'dist/',
                'vite.config.ts',
                'eslint.config.js',
                'src/main.ts',
                'src/app.vue',
                'src/**/*.d.ts',
                'src/shared/config/**',
                'src/shared/assets/**',
                'src/shared/locales/**',
                'src/shared/types/**',
                'src/**/__mocks__/**',
                'src/**/__tests__/**',
                'src/**/*.stories.ts',
                'src/**/*.stories.tsx',
                'src/**/*.stories.vue',
                'src/**/index.ts',
                'src/**/types.ts',
                'src/**/router.ts',
            ],
        },
    },
});
