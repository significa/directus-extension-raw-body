# Directus raw body extension

Simple Directus extension that sets the serialized request body in the express request object.


## Installation / Configuration guide

In your Directus project directory run:

```sh
npm install @significa/directus-extension-raw-body
```

Create an environment variable `RAW_BODY_ENDPOINT_PATTERN` with a Regex Expression matching the
endpoints/routes where `rawBody` will be added to the request object.

Examples:

```env
# Matches all endpoints for a specific extension
RAW_BODY_ENDPOINT_PATTERN='^\/sample-extension\/.*$'

# Matches all endpoints (avoid: you should only set rawBody for custom endpoints)
RAW_BODY_ENDPOINT_PATTERN='^.*$'

# Matches two routes /hello-world and /sample/path
RAW_BODY_ENDPOINT_PATTERN='^(\/hello-world|\/sample\/path)$'

# Matches routes with variable input in path. Ex:
#  - /sample/cats/fifi
#  - /sample/cats/bob1
#  - /sample/aaaa/info
#  - /sample/bbbb/info
RAW_BODY_ENDPOINT_PATTERN='^(\/sample\/cats\/\D+|\/sample\/[a-z]+\/info)$'
```

Restart Directus for the changes to take effect.


## Usage

Create a directus endpoint extension:

 - JS
    ```js
    export default (router, _) => {
      router.post(
        '/sample',
        async (req, res, _next) => {
        console.log('Raw body:', req.rawBody)

         return res.json({
           status: 'OK',
           rawBody: req.rawBody,
         })
      }
    )
    ```

 - TS
    ```ts
    import { NextFunction, Request, Response, Router, } from 'express'
    import { ApiExtensionContext } from '@directus/shared/types'
    import { RequestWithRawBody } from "@significa/directus-extension-raw-body";
  
    export default (router, extensionContext: ApiExtensionContext) => {
      router.post(
        '/sample',
        async (req: RequestWithRawBody, res: Response, _next: NextFunction) => {
          console.log('Raw body:', req.rawBody)

          return res.json({
            status: 'OK',
            rawBody: req.rawBody,
          })
        }
      )
    })
    ```


