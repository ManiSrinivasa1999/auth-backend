import { decryptData } from '../encryption'
import { getCache } from '../redis/actions'
import { verifyAndDecode } from '../token/jwt-token-manager'

type TokenInfo = {
  id: string
  email: string
  exp: number
  iat: number
}

export const generateTTL = (tokenExp: number) => {
  const currentTime = Math.floor(Date.now() / 1000)
  const secondsToExpire = tokenExp - currentTime
  return secondsToExpire > 0 ? secondsToExpire : 0
}

export const generateRedisKey = (userId: string) => {
  return 'user-' + userId
}

export const validateAccessToken = async (token: string) => {
  try {
    const decodedData = (await verifyAndDecode(token)) as TokenInfo | null
    if (decodedData) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.log('Unable to validate access token', error)
  }
}

export const validateRefreshToken = async (encryptedToken: string) => {
  const jwtToken = await decryptData(encryptedToken)
  try {
    const decodedData = (await verifyAndDecode(jwtToken)) as TokenInfo | null
    if (!decodedData) {
      return false
    }
    const encryptedTokenFromCache = await getCache(generateRedisKey(decodedData?.id))
    if (!encryptedTokenFromCache) {
      console.log('Not found token in memory')
      return false
    }
    const decrptedTokenFromCache = await decryptData(encryptedTokenFromCache)
    const decodedJwtDataFromCache = (await verifyAndDecode(
      decrptedTokenFromCache
    )) as TokenInfo | null
    if (encryptedToken !== encryptedTokenFromCache && decrptedTokenFromCache !== jwtToken) {
      console.log('Token Malfunctioned')
      return false
    }
    const ttl = generateTTL(decodedJwtDataFromCache!.exp)
    if (ttl <= 0) {
      console.log('token exipred in memory')
      return false
    }
    return { ...decodedJwtDataFromCache }
  } catch (error) {
    console.log('Unable to validate refresh token', error)
  }
}
