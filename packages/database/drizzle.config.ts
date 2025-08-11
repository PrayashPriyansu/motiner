import { defineConfig } from 'drizzle-kit'
import { config } from 'dotenv'

// Load environment variables from root .env file
config({ path: '../../.env' })

export default defineConfig({
  out: './migrations',
  schema: [
    './src/schema/sites.schema.ts',
    './src/schema/ping.schema.ts', 
    './src/schema/site-stats.schema.ts'
  ],
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})