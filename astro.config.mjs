import { defineConfig } from 'astro/config'
import db from '@astrojs/db'
import svelte from '@astrojs/svelte'
import netlify from '@astrojs/netlify'

// https://astro.build/config
export default defineConfig({
  integrations: [db(), svelte()],
  output: 'server',
  adapter: netlify(),
})
