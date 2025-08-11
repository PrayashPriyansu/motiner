import type { AppOpenAPI } from './types'

import { Scalar } from '@scalar/hono-api-reference'
import packageJson from '../../package.json' with { type: 'json' }

export default function configureOpenApi(app: AppOpenAPI) {
  app.doc('/doc', {
    openapi: '3.0.0',
    info: {
      version: packageJson.version,
      title: 'Monitor API',
    },
  })
  
  app.get('/scalar', Scalar({
    url: '/doc',
    theme: 'kepler',
    layout: 'classic',
    defaultHttpClient: {
      targetKey: 'js',
      clientKey: 'fetch',
    },
  }))
}

// () => {
//     return {
//       url: '/doc',
//       // proxyUrl: c.env.ENVIRONMENT === 'development' ? 'https://proxy.scalar.com' : undefined,
//     }
//   }
