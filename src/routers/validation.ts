import { Router } from 'express'
import { vaidateAuthMiddleware } from '../middlewares/auth.middleware'

const validationRouter = Router()

// @ts-ignore
validationRouter.put("/tokens", vaidateAuthMiddleware)

export default validationRouter
