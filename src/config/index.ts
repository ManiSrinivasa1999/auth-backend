import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm'
import dotenv from 'dotenv'

dotenv.config()

const ssm = new SSMClient({ region: process.env.AWS_REGION })

async function getSSMParameter(name: string): Promise<string> {
  try {
    const command = new GetParameterCommand({
      Name: name,
      WithDecryption: true,
    })
    const response = await ssm.send(command)
    if (!response.Parameter?.Value) throw new Error(`Missing value for ${name}`)
    return response.Parameter.Value
  } catch (error) {
    console.error(`Error fetching ${name}:`, error)
    throw error
  }
}

export async function loadConfig() {
  return {
    PORT: process.env.PORT || 5000,
    MYSQL_HOST: process.env.MYSQL_HOST || (await getSSMParameter('/app/auth/MYSQL_HOST')),
    MYSQL_USER: process.env.MYSQL_USER || (await getSSMParameter('/app/auth/MYSQL_USER')),
    MYSQL_PASSWORD:
      process.env.MYSQL_PASSWORD || (await getSSMParameter('/app/auth/MYSQL_PASSWORD')),
    MYSQL_DATABASE:
      process.env.MYSQL_DATABASE || (await getSSMParameter('/app/auth/MYSQL_DATABASE')),
    MYSQL_PORT: +process!.env!.MYSQL_PORT! || (await getSSMParameter('/app/auth/MYSQL_PORT')),
    JWT_SECRET_KEY: await getSSMParameter('/app/token/JWT_SECRET_KEY'),
    ENCRYPTION_KEY: await getSSMParameter('/app/token/ENCRYPTION_KEY'),
    COOKIE_SECRET: await getSSMParameter('/app/token/COOKIE_SECRET'), 
  }
}

export async function getEncryptionKey(): Promise<Buffer> {
  const base64Key = await getSSMParameter("/app/token/ENCRYPTION_KEY")
  return Buffer.from(base64Key, "base64")
}
