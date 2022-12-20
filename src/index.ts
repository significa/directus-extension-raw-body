import { defineHook } from '@directus/extensions-sdk'
import express, { Request } from 'express'
import { IncomingMessage, ServerResponse } from 'http'

export type RequestWithRawBody = IncomingMessage & Request & { rawBody: string }

export default defineHook(({ init }, { env, logger }) => {
  let raw_body_endpoint_pattern: RegExp

  init('middlewares.before', async function ({ app }) {
    logger.info(
      `Starting directus-extension-raw-body for URLs matching: ${env.RAW_BODY_ENDPOINT_PATTERN}`
    )

    raw_body_endpoint_pattern = new RegExp(env.RAW_BODY_ENDPOINT_PATTERN)

    app.use(
      express.json({
        verify: (
          req: RequestWithRawBody,
          _res: ServerResponse,
          buf: Buffer,
          _encoding: string
        ) => {
          if (
            raw_body_endpoint_pattern &&
            req.originalUrl.match(raw_body_endpoint_pattern)
          ) {
            logger.debug(
              `Setting up 'rawBody' in request object for ${req.originalUrl}`
            )
            req.rawBody = buf.toString()
          }
        },
      })
    )
  })
})
