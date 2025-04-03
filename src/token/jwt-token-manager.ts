import jwt from 'jsonwebtoken'
import { loadConfig } from '../config'

export const generateToken = async (id: string, email: string, tokenType: 'access' | 'refresh') => {
  const config = await loadConfig()
  const token = jwt.sign({ id, email }, config.JWT_SECRET_KEY, {
    expiresIn: '1h',
  })
  return token
}
