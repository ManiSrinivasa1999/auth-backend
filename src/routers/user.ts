// @ts-nocheck
import { Router } from 'express'
import {
  getUserByID,
  getUserProfile,
  registerUser,
  loginUser,
  deleteUser,
} from '../handlers/user-handler'
import { validateAuthTokens } from '../middlewares/jwt-token-validator'

const userRouter = Router()

// always routes should be exposed first and then only id elese those routes will be taken as id 
userRouter.get('/profile', validateAuthTokens, getUserProfile)
userRouter.get('/:id', getUserByID)
userRouter.post('/signup', registerUser)
userRouter.post('/signin', loginUser)
userRouter.delete('/:id', deleteUser)

export default userRouter
