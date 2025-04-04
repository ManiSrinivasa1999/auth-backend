import crypto from 'crypto'
import { loadConfig } from '../config'

const iv = crypto.randomBytes(16)
const algorithm = 'aes-256-cbc'

export const encryptData = async (data: string) => {
  const config = await loadConfig()
  const key = Buffer.from(config.ENCRYPTION_KEY)
  const cipher = crypto.createCipheriv(algorithm, key, iv)
  let encrypted = cipher.update(data, 'utf-8', 'hex')
  return encrypted
}

export const decryptData = async (encrypted: string) => {
  const config = await loadConfig()
  const key = Buffer.from(config.ENCRYPTION_KEY)
  const decipher = crypto.createDecipheriv(algorithm, key, iv)
  let decrypted = decipher.update(encrypted, 'hex', 'utf-8')
  decrypted += decipher.final('utf-8')
  return decrypted
}
