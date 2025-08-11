import { createRouter } from 'api/lib/create-app'
import * as handlers from './sites.handlers'
import * as routes from './sites.routes'

const router = createRouter()
  .openapi(routes.getAll, handlers.getAll)
  .openapi(routes.create, handlers.create)
  .openapi(routes.getById, handlers.getById)
  .openapi(routes.update, handlers.update)
  .openapi(routes.remove, handlers.remove)
export default router
