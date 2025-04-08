import crypto from 'crypto'
import { getEncryptionKey } from '../config'

const iv = crypto.randomBytes(16)
const algorithm = 'aes-256-cbc'

export const encryptData = async (data: string) => {
  const ENCRYPTION_KEY = await getEncryptionKey()
  const cipher = crypto.createCipheriv(algorithm, ENCRYPTION_KEY, iv)
  let encrypted = cipher.update(data, 'utf-8', 'hex')
  encrypted += cipher.final("hex")
  return encrypted
}

export const decryptData = async (encrypted: string) => {
  const ENCRYPTION_KEY = await getEncryptionKey()
  const decipher = crypto.createDecipheriv(algorithm, ENCRYPTION_KEY, iv)
  let decrypted = decipher.update(encrypted, 'hex', 'utf-8')
  decrypted += decipher.final('utf-8')
  return decrypted
}
