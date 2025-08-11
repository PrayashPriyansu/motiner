import sites from 'api/routes/sites/sites.index'
import monitoring from 'api/routes/monitoring/monitoring.index'
import pingTriggers from 'api/routes/ping-triggers/ping-triggers.index'
import { cors } from 'hono/cors'
import configureOpenApi from './lib/configure-open-api'
import createApp from './lib/create-app'
import index from './routes/index.route'

const app = createApp()

app.use('*', cors())
configureOpenApi(app)

const routes = [
  index,
  sites, // Routes for managing sites to monitor
  monitoring, // Simple monitoring routes for website checking
  pingTriggers, // Intelligent ping trigger system (easily extractable for scaling)
]

routes.forEach(route => app.route('/', route))

export default app
