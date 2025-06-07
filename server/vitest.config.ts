import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    test: {
        globals: true,
        environment: 'node',
        setupFiles: [],
        coverage: {
            reporter: ['text', 'json', 'html'],
            reportsDirectory: 'coverage',
            exclude: [
                'node_modules/',
                'dist/',
                'vite.config.ts',
                'eslint.config.js',
                'src/**/*.d.ts',
                'src/**/__mocks__/**',
                'src/**/__tests__/**',
                '**/types/**',
                '**/constants/**',
                '**/vitest.config.ts',
                '**/routes/**',
                '**/db.ts',
            ],
        },
    },
});
