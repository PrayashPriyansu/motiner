// Simple Vercel serverless function
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono()

app.get('/', (c) => {
  return c.json({ message: 'API is running on Vercel!' })
})

app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Add a simple sites endpoint for testing
app.get('/sites', (c) => {
  return c.json({ message: 'Sites endpoint - database connection needed' })
})

export default handle(app)