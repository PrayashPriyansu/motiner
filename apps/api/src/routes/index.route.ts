import { createRoute } from '@hono/zod-openapi'
import { HttpCode } from 'api/http/index'
import { createRouter } from 'api/lib/create-app'
import jsonContent from 'api/openapi/helpers/json-content'
import createMessageObjectSchema from 'api/openapi/schema/create-message-object'

const router = createRouter().openapi(
  createRoute({
    tags: ['Index'], // this is to show as the header group in scalar ui
    method: 'get',
    path: '/',
    responses: {
      [HttpCode.OK]: jsonContent(createMessageObjectSchema('pong'), 'ping'),
    },
  }),
  (c) => {
    return c.json(
      {
        message: 'pong',
      },
      HttpCode.OK,
    )
  },
)

export default router
