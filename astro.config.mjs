import { defineConfig } from 'astro/config'
import db from '@astrojs/db'
import svelte from '@astrojs/svelte'
import vercel from '@astrojs/vercel/serverless'

// https://astro.build/config
export default defineConfig({
  integrations: [db(), svelte()],
  output: 'server',
  adapter: vercel(),
})
