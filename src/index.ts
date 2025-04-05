import app from './app'
import { config } from 'dotenv'
import { connectToDb } from './mysql/connection'
import { initializeRedis } from './redis/connection'
import { loadConfig } from './config';

config()

const init = async () => {
  try {
    await loadConfig()
    await connectToDb()
    await initializeRedis();
    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => {
      console.info(`Application is running at ${PORT}`)
    })
  } catch (error) {
    console.log(`App failed to initialize:`, error)
    process.exit(1)
  }
}

init()
