import { createRouter } from '../../lib/create-app'
import * as routes from './ping-triggers.routes'
import * as handlers from './ping-triggers.handlers'

/**
 * Ping trigger routes for intelligent site monitoring
 * - POST /ping-triggers/trigger - Intelligently ping sites based on their intervals
 * - GET /ping-triggers/status - Get information about which sites are due for pinging
 * 
 * This module is designed to be easily extractable into a standalone worker service
 * for horizontal scaling of the monitoring system.
 */
const router = createRouter()
  .openapi(routes.triggerPings, handlers.triggerPings)
  .openapi(routes.getTriggerStatus, handlers.getTriggerStatus)

export default router