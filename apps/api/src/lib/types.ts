import type { Context } from 'hono'
import type { RouteConfig, RouteHandler, OpenAPIHono } from '@hono/zod-openapi'

/**
 * App bindings for Hono context
 */
export type AppBindings = {}

/**
 * OpenAPI Hono app type
 */
export type AppOpenAPI = OpenAPIHono<AppBindings>

/**
 * Generic type for API route handlers
 * Provides proper typing for Hono + OpenAPI route handlers
 */
export type AppRouteHandler<T extends RouteConfig> = RouteHandler<T>

/**
 * Generic Hono context type
 */
export type AppContext = Context