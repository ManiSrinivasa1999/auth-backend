import { Request, Response } from 'express'
import { pool } from '../mysql/connection'
import { GET_USER_BY_EMAIL, GET_USER_BY_ID } from '../mysql/queries'
import { DELETE_USER_STATEMENT, INSERT_USER_STATEMENT } from '../mysql/mutations'
import bcrypt from 'bcrypt'
import { generateToken, saveRefreshToken } from '../token/jwt-token-manager'
import { encryptData } from '../encryption'

const getUserBy = async (by: 'email' | 'id', value: string) => {
  try {
    const connection = await pool.getConnection()
    const result = await connection.query(by === 'email' ? GET_USER_BY_EMAIL : GET_USER_BY_ID, [
      value,
    ])
    // @ts-ignore
    const user = result[0][0]
    return user
  } catch (error) {
    console.error(error)
    throw error
  }
}

const setAuthTokens = async (id: string, email: string, res: Response) => {
  try {
    const token = await generateToken(id, email, 'access')
    const refreshToken = await generateToken(id, email, 'refresh')
    await saveRefreshToken(refreshToken)
  } catch (error) {}
}

const getUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id
    if (!userId || isNaN(Number(userId))) {
      return res.status(400).json({
        message: 'Invalid user Id',
      })
    }
    const user = await getUserBy('id', userId)
    if (!user) {
      return res.status(400).json({ message: 'No user found' })
    }
    return res.status(200).json({ message: 'User profile details', user })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Unexpected error occured, Try again later.' })
    throw error
  }
}

const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(422).json({ message: 'Data missing' })
    }
    const user = await getUserBy('email', email)
    if (user) {
      return res.status(409).json({ message: 'user already exists', user })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const connection = await pool.getConnection()
    const result = await connection.query(INSERT_USER_STATEMENT, [name, email, hashedPassword])
    return res.status(201).json({ message: 'User profile created successfully', user: result[0] })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Failed to create user profile, Try again later.' })
    throw error
  }
}

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(422).json({ message: 'Data missing' })
    }
    const user = await getUserBy('email', email)
    if (!user) {
      return res.status(404).json({ message: `User not found with this email: ${email}` })
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid password' })
    }

    // set token

    return res.status(200).json({ message: 'User login successfully', user })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Failed to create user profile, Try again later.' })
    throw error
  }
}

const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id
    if (!userId || isNaN(Number(userId))) {
      return res.status(400).json({
        message: 'Invalid user Id',
      })
    }
    const connection = await pool.getConnection()
    const result = await connection.query(DELETE_USER_STATEMENT, [userId])
    return res.status(200).json({ message: 'User profile deleted successfully', user: result[0] })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Failed to delete user, Try again later.' })
    throw error
  }
}
export { getUser, registerUser, loginUser, deleteUser }
