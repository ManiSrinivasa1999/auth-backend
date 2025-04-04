import jwt from 'jsonwebtoken'
import { loadConfig } from '../config'
import { setCache } from '../redis/actions'
import { generateRedisKey, generateTTL } from '../utils/helper'
import { encryptData } from '../encryption'

export const generateToken = async (id: string, email: string, tokenType: 'access' | 'refresh') => {
  const config = await loadConfig()
  const token = jwt.sign({ id, email }, config.JWT_SECRET_KEY, {
    expiresIn: '1h',
  })
  return token
}

export const decodeToken = (token: string) => {
  return jwt.decode(token, {json: true})
}

export const saveRefreshToken = async (token: string) => {
  const decodedData = decodeToken(token)
  if (!decodedData) {
    throw new Error('Unable to decode token')
  }
  const key = generateRedisKey(decodedData.id)
  const TTL = generateTTL(decodedData.exp!)
  try {
    await setCache(key, await encryptData(token), TTL)
    console.log('Saved Refresh Token')
  } catch (error) {
    console.error(error)
  }
}
