import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import { config } from 'dotenv'
import * as schema from './schema/index'

// Load environment variables from root .env file
config({ path: '../../.env' })

// Get database URL from environment
const getDatabaseUrl = (): string => {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('DATABASE_URL environment variable is required')
  }
  return url
}

// Create Neon connection
export const connection = neon(getDatabaseUrl())

// Create Drizzle database instance
export const db = drizzle(connection, {
  schema,
})

// Export type for use in consuming applications
export type DatabaseConnection = typeof db