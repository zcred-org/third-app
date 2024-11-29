import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { checker } from 'vite-plugin-checker';
import { compression } from 'vite-plugin-compression2';
import packageJson from './package.json';


// https://vitejs.dev/config/
export default defineConfig(() => {
  const lintCommand = packageJson.scripts.lint;
  const VITE_BUILD_ID = Date.now().toString(36);

  return ({
    plugins: [
      react(),
      checker({
        enableBuild: false,
        overlay: { initialIsOpen: false, position: 'br' },
        typescript: true,
        eslint: {
          lintCommand,
          useFlatConfig: false,
        },
      }),
      compression({ algorithm: 'gzip' }),
      compression({ algorithm: 'brotliCompress' }),
    ],
    define: {
      'import.meta.env.VITE_BUILD_ID': JSON.stringify(VITE_BUILD_ID),
    },
    server: {
      port: 5180,
      host: true,
    },
    resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  });
});
