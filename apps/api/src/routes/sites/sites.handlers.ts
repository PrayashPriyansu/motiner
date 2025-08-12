import type { AppRouteHandler } from 'api/lib/types.js'
import type { CreateRoute, GetAllRoute, GetByIdRoute, RemoveRoute, UpdateRoute } from './sites.routes.js'
import { db, sites } from '@repo/database'
import { HttpCode, HttpMsg } from 'api/http/index.js'
import { eq } from 'drizzle-orm'

export const getAll: AppRouteHandler<GetAllRoute> = async (c) => {
  const result = await db.query.sites.findMany()
  return c.json(result)
}

export const getById: AppRouteHandler<GetByIdRoute> = async (c) => {
  const { id } = c.req.valid('param')

  const [result] = await db.select().from(sites).where(eq(sites.id, id))

  if (!result) {
    return c.json({
      message: HttpMsg.NOT_FOUND,
    }, HttpCode.NOT_FOUND)
  }

  return c.json(result, HttpCode.OK)
}

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const site = c.req.valid('json') // all the extra fields are stripped away only valid data comes here
  // this comes as in if there is a validatioion error with respect to the schema in the request body in router then
  // default hook is called see create-app.ts file

  const [result] = await db.insert(sites).values(site as typeof sites.$inferInsert).returning()

  return c.json(result, HttpCode.OK)
}

export const update: AppRouteHandler<UpdateRoute> = async (c) => {
  const { id } = c.req.valid('param')
  const body = c.req.valid('json')

  const [result] = await db.update(sites).set(body as Partial<typeof sites.$inferInsert>).where(eq(sites.id, id)).returning()

  if (!result) {
    return c.json({
      message: HttpMsg.NOT_FOUND,
    }, HttpCode.NOT_FOUND)
  }

  return c.json(result, HttpCode.OK)
}

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const { id } = c.req.valid('param')

  const [result] = await db.update(sites).set({ status: 'delete' }).where(eq(sites.id, id)).returning()

  if (!result) {
    return c.json({
      message: HttpMsg.NOT_FOUND,
    }, HttpCode.NOT_FOUND)
  }

  return c.json(result, HttpCode.OK)
}
