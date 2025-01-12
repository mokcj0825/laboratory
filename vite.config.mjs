import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// Vite configuration
export default defineConfig({
    plugins: [
        react(),  // Enables React fast refresh and other optimizations
        tsconfigPaths()  // Supports TypeScript path mappings
    ],
    server: {
        port: 3000  // Specifies the development server port
    }
});
