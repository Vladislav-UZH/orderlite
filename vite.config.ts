import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import IstanbulPlugin from 'vite-plugin-istanbul';

export default defineConfig({
  plugins: [
    react(),
    IstanbulPlugin({
      cypress: true,
      requireEnv: false,
    }),
  ],
});
