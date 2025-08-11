import type { Hook } from '@hono/zod-openapi'
import { UNPROCESSABLE_ENTITY } from 'api/http/http-status-codes'
import { ZodError } from 'zod'

const defaultHook: Hook<any, any, any, any> = (result, c) => {
  if (!result.success) {
    const error = result.error
    const issues = error instanceof ZodError
      ? error.issues.map(issue => ({
          variable: issue.path.join('.'),
          message: issue.message,
        }))
      : error

    return c.json(
      {
        success: false,
        errors: issues,
      },
      UNPROCESSABLE_ENTITY,
    )
  }
}

export default defaultHook
