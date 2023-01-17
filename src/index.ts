import { defineHook } from '@directus/extensions-sdk'
import express, { Request } from 'express'
import { IncomingMessage, ServerResponse } from 'http'

const EXTENSION_NAME = 'directus-extension-raw-body'

export type RequestWithRawBody = IncomingMessage & Request & { rawBody: string }

export default defineHook(({ init }, { env, logger: rootLogger }) => {
  const logger = rootLogger.child({ extension: EXTENSION_NAME })

  let raw_body_endpoint_pattern: RegExp

  init('middlewares.before', async function ({ app }) {
    if (!env.RAW_BODY_ENDPOINT_PATTERN) {
      logger.warn(
        `${EXTENSION_NAME} 'RAW_BODY_ENDPOINT_PATTERN' not configured`
      )
      return
    }

    raw_body_endpoint_pattern = new RegExp(env.RAW_BODY_ENDPOINT_PATTERN)

    app.use(
      express.json({
        verify: (
          req: RequestWithRawBody,
          _res: ServerResponse,
          buf: Buffer,
          _encoding: string
        ) => {
          if (req.originalUrl.match(raw_body_endpoint_pattern)) {
            logger.debug(
              `${EXTENSION_NAME} Setting up 'rawBody' in request object for ${req.originalUrl}`
            )
            req.rawBody = buf.toString()
          }
        },
      })
    )

    logger.info(
      `${EXTENSION_NAME} loaded matching '${env.RAW_BODY_ENDPOINT_PATTERN}'`
    )
  })
})
