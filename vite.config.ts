import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import aiReadability from './scripts/ai-readability'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), aiReadability()],
  base: "/resume/",
});
