import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  esbuild: {
    loader: 'jsx',
    include: /\.[jt]sx?$/
    // حذفنا jsxInject لمنع التداخل مع استيراد React
  }
});
