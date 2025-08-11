import type { AppBindings } from './types'
import { OpenAPIHono } from '@hono/zod-openapi'
import notFound from 'api/handlers/not-found'
import onError from 'api/handlers/on-error'
import serveEmojiFavicon from 'api/handlers/serve-favicon'
import { customLogger } from 'api/middlewares/pino-logger'
import defaultHook from 'api/openapi/hooks/default-hook'

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false, // strict mode differentiates between /hello and /hello/ which I dont weant
    defaultHook, // if there is a validation error in any endpoint which is defined

  })
}

export default function createApp() {
  const app = createRouter()
  app.use(customLogger())
  app.use(serveEmojiFavicon('🚀'))
  app.notFound(notFound)

  app.onError(onError)

  return app
}

// app.get('/', (c) => {
//   c.var.logger.info('Wo log here') // this is actually accessing the pino logger
//   c.var.logger.debug('Wo log here') // this is only visible when the log level is set to debug
//   return c.text('Hello Hono!')
// })
