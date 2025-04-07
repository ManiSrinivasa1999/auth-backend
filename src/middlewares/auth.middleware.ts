import { Request, Response } from 'express'
import { validateAccessToken, validateRefreshToken } from '../utils/helper'
import { generateToken, saveRefreshToken } from '../token/jwt-token-manager'
import { encryptData } from '../encryption'
import { setCookies } from '../handlers/user-handler'

export const vaidateAuthMiddleware = async (req: Request, res: Response) => {
  // @ts-ignore
  const [access, refresh] = req.headers?.authorization?.split(',')
  const accessToken = access && access.split('=')[1]
  const refreshToken = refresh.split("=")[1];
  
  const isAccessTokenValid = await validateAccessToken(accessToken)
  const decodeRefreshToken = await validateRefreshToken(refreshToken)
  if (isAccessTokenValid && decodeRefreshToken) {
    console.log('Access token, refresh tokens are valid')
    return res.status(200).json({
      message: 'Authorized',
      success: true,
    })
  } else if (!isAccessTokenValid && decodeRefreshToken) {
    // regenerate new token
    const newAccessToken = await generateToken(
      decodeRefreshToken.id!,
      decodeRefreshToken.email!,
      'access'
    )
    const newRefreshToken = await generateToken(
      decodeRefreshToken.id!,
      decodeRefreshToken.email!,
      'refresh'
    )

    const newEncryptedRefreshToken = await encryptData(newRefreshToken)
    await saveRefreshToken(newAccessToken, newEncryptedRefreshToken)
    setCookies(newAccessToken, newEncryptedRefreshToken, res)
    return res.status(200).json({
      message: 'Authorized',
      success: true,
    }) 
  } else {
    return res.status(401).json({
      message: 'Not Authorized',
      success: false,
    })
  }
}
