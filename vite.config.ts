
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import * as dotenv from 'dotenv';
import fs from 'fs';

export default defineConfig(({ mode }) => {
  // Load env file from current directory, with VITE_ prefix
  const env = loadEnv(mode, process.cwd(), '');

  // Explicitly fallback to dotenv for debugging if loadEnv fails to pick up
  // Note: loadEnv should work, but we want to be sure and see logs.

  // Try loading .env.local manually
  if (fs.existsSync('.env.local')) {
    const localEnv = dotenv.parse(fs.readFileSync('.env.local'));
    Object.assign(env, localEnv);
    console.log('Loaded .env.local manual override:', Object.keys(localEnv));
  }

  console.log('Vite Config Loaded Env Vars:', {
    SUPABASE_URL: env.VITE_SUPABASE_URL ? 'Found' : 'Missing',
    GEMINI_KEY: env.VITE_GEMINI_API_KEY ? 'Found' : 'Missing',
    NOTION_ID: env.VITE_NOTION_CLIENT_ID ? 'Found' : 'Missing'
  });

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        '/api/notion': {
          target: 'https://api.notion.com/v1',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/notion/, ''),
          secure: true,
        },
      },
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      // Force inject variables to ensure they are available
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
      'import.meta.env.VITE_NOTION_CLIENT_ID': JSON.stringify(env.VITE_NOTION_CLIENT_ID),
      'import.meta.env.VITE_NOTION_CLIENT_SECRET': JSON.stringify(env.VITE_NOTION_CLIENT_SECRET),
      'import.meta.env.VITE_NOTION_REDIRECT_URI': JSON.stringify(env.VITE_NOTION_REDIRECT_URI),
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
