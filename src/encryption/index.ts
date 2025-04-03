import crypto from 'crypto'
import { loadConfig } from '../config'

const iv = crypto.randomBytes(16) 

const encryptData = async (data: string) => {
  const config = await loadConfig()
  const key = Buffer.from(config.ENCRYPTION_KEY)
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
  let encrypted = cipher.update(data, 'utf-8', 'hex')
  return encrypted
}
