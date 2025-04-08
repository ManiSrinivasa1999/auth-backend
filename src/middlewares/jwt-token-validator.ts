import { NextFunction, Request, Response } from 'express'
import { validateRefreshToken } from '../utils/helper'

export const validateAuthTokens = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    const [_access, refresh] = req.headers?.authorization?.split(',')
    const refreshToken = refresh.split('=')[1]
    const decryptedRefreshToken = await validateRefreshToken(refreshToken)

    if (!decryptedRefreshToken) {
      return res.status(401).json({ message: 'Not authorized' })
    }

    res.locals.jwtData = decryptedRefreshToken
    return next()
  } catch (error) {
    return res.json({ message: 'Something went wrong' })
  }
}
