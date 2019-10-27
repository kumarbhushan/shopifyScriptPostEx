require('isomorphic-fetch')
const dotenv = require('dotenv')
dotenv.config()
const Koa = require('koa')
const send = require('koa-send')
const next = require('next')
const fs = require("fs");
const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth')
const { verifyRequest } = require('@shopify/koa-shopify-auth')
const session = require('koa-session')
const { default: graphQLProxy } = require('@shopify/koa-shopify-graphql-proxy')
const { ApiVersion } = require('@shopify/koa-shopify-graphql-proxy')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser');
const port = parseInt(process.env.PORT, 10) || 8081
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const request = require('request-promise')
const { SHOPIFY_API_SECRET_KEY, SHOPIFY_API_KEY, HOST } = process.env
const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}
app.prepare().then(() => {
  const server = new Koa()
  const router = new Router()
  server.use(session(server))
  server.keys = [SHOPIFY_API_SECRET_KEY || '8536f463c8621180321ff69ff3f56d10']
  server.use(bodyParser());
  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY || 'e41ca7c350b0bb152e810494d75432bd',
      secret: SHOPIFY_API_SECRET_KEY || '8536f463c8621180321ff69ff3f56d10',
      scopes: [
        'read_script_tags',
        'write_script_tags'
      ],
      async afterAuth(ctx) {
        const { shop, accessToken } = ctx.session
        ctx.cookies.set('shopOrigin', shop, { httpOnly: false })
        ctx.redirect('/')
      }
    })
  )
  server.use(graphQLProxy({ version: ApiVersion.July19 }))
  router.get('/testScript.js', async ctx => {
    let _file = await readFile("server/testScript.js")
    let data = _file.toString()
    ctx.body = data
  })
  router.get('*', verifyRequest(), async ctx => {
    let productCollections = {}
    let db_doc = {}
    try {
      let shopResponse = await getScriptTag(
        ctx.session.shop,
        ctx.session.accessToken
      )
      let script = JSON.parse(shopResponse).script_tags.find(item =>
        item.src.includes('testScript.js')
      )
      if (!script) {
        let sCreate = await createScriptTag(
          ctx.session.shop,
          ctx.session.accessToken
        )
        console.log('sCreate', sCreate)
      } else if (script.src.includes('ngrok.io') || !script.src.includes('?shop=')) {
        await deleteScriptTag(script.id, ctx.session.shop, ctx.session.accessToken)
        await createScriptTag(ctx.session.shop, ctx.session.accessToken)
      }
    } catch (err) {
      console.log('err', err)
    }
    await handle(ctx.req, ctx.res)
    ctx.respond = false
    ctx.res.statusCode = 200
  })
  server.use(router.allowedMethods())
  server.use(router.routes())
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
  })
})
async function getScriptTag(shop, token) {
  const shopRequestUrl =
    'https://' + shop + '/admin/api/2019-07/script_tags.json'
  const shopRequestHeaders = { 'X-Shopify-Access-Token': token }
  return request.get(shopRequestUrl, { headers: shopRequestHeaders })
}
async function createScriptTag(shop, token) {
  const shopRequestUrl =
    'https://' + shop + '/admin/api/2019-07/script_tags.json'
  const shopRequestHeaders = { 'X-Shopify-Access-Token': token }
  var options = {
    method: 'POST',
    uri: shopRequestUrl,
    body: {
      script_tag: { event: 'onload', src: HOST + '/testScript.js?shop=' + shop }
    },
    headers: shopRequestHeaders,
    json: true
  }
  return request(options)
}
async function deleteScriptTag(scriptTagId, shop, token) {
  const shopRequestUrl =
    'https://' + shop + '/admin/api/2019-07/script_tags/' + scriptTagId + '.json'
  const shopRequestHeaders = { 'X-Shopify-Access-Token': token }
  var options = {
    method: 'DELETE',
    uri: shopRequestUrl,
    headers: shopRequestHeaders,
    json: true
  }
  return request(options)
}
async function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}