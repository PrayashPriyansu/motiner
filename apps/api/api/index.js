// Simple Vercel serverless function
const { Hono } = require('hono')
const { handle } = require('hono/vercel')

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

module.exports = handle(app)