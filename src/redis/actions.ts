import { redisClient } from './connection'

const setCache = (key: string, data: string, EX: number) => {
  try {
    // NX - onlt set when key doesn't exists
    // EX - directly set expiry
    redisClient.set(key, data, { EX })
    console.log('Redis: Set-Cache', key, 'Value: ', data)
  } catch (error) {
    console.error(error)
    throw error
  }
}

const getCache = async (key: string) => {
  try {
    const value = await redisClient.get(key)
    console.log('Redis: Get-Cache', key, 'Value: ', value)
    return value
  } catch (error) {
    console.error(error)
    throw error
  }
}

export {getCache, setCache}