import { createPool, Pool } from 'mysql2/promise'
import { CREATE_TABLE_USERS } from './tables'
import { loadConfig } from '../config'

let pool: Pool

const connectToDb = async () => {
  const config = await loadConfig()
  try {
    pool = createPool({
      port: +config.MYSQL_PORT,
      host: config.MYSQL_HOST,
      user: config.MYSQL_USER,
      password: config.MYSQL_PASSWORD,
      database: config.MYSQL_DATABASE,
    })
    await pool.getConnection()
    await pool.execute(CREATE_TABLE_USERS)
    console.log('Connected to MYSql')
  } catch (error) {
    console.log('Failed to connected to MYSql', error)
  }
}

export { connectToDb, pool }
