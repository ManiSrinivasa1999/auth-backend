import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import appRouter from './routers'
import cookieParser from 'cookie-parser'
import { loadConfig } from './config'

const app = express()

let config
;(async () => {
  config = await loadConfig()
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(cookieParser(config.COOKIE_SECRET))
  app.use(helmet())
  app.use(morgan('dev'))
  app.use((req, res, next) => {
    console.log("Req received");
    console.log("Req URL", req.baseUrl + req.url);
    console.log(JSON.stringify(req.headers));
    next()
  })
  app.use('/api/v1/auth', appRouter)
})()

export default app
