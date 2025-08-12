import { serve } from '@hono/node-server'
import { handle } from 'hono/vercel'
import app from './app'
import env from './env'

// For local development
if (process.env.NODE_ENV !== 'production') {
  console.log('🚀 Starting API server...')
  
  serve({
    fetch: app.fetch,
    port: Number(env.PORT) || 3000,
  }, (info) => {
    console.log(`✅ Server is running on http://localhost:${info.port}`)
    console.log(`📖 API documentation available at http://localhost:${info.port}/scalar`)
  })
}

// For Vercel deployment
export default handle(app)
