# Directus raw body extension

Simple Directus extension that sets the serialized request body in the express request object.


## Installation / Configuration guide

In your Directus project directory run:

```sh
npm install directus-extension-raw-body
```

Create an environment variable `RAW_BODY_ENDPOINT_PATTERN` with a Regex Expression matching the
endpoints/routes where `rawBody` will be added to the request object.

Examples:

```env
# Matches all endpoints for a specific extension
RAW_BODY_ENDPOINT_PATTERN='^\/sample-extension\/.*$'

# Matches all endpoints (not recommended)
RAW_BODY_ENDPOINT_PATTERN='*'

# Matches two routes /hello-world and /sample/path
RAW_BODY_ENDPOINT_PATTERN='^(\/hello-world|\/sample\/path)$'
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
           raw_body: req.rawBody,
         })
      }
    )
    ```

 - TS
    ```ts
    export default (router, _) => {
      router.post(
        '/sample',
        async (req: RequestWithRawBody, res: ServerResponse, _next) => {
        console.log('Raw body:', req.rawBody)

        return res.json({
          status: 'OK',
          raw_body: req.rawBody,
        })
      }
    )
    ```


