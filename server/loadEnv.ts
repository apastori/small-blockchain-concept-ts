import { readFileSync } from 'fs'
import { join } from 'path'
import { EnvLoadingError } from './errors/EnvLoadingError'
import { EnvInvalidStringError } from './errors/EnvInvalidStringError'
import { isValidString } from './utils/isValidString'
import { isValidJSON } from './utils/isValidJSON'
import { EnvInvalidJSONError } from './errors/EnvInvalidJSONError'
import { isValidProcessEnv } from './utils/isValidProcessEnv'
import { EnvInvalidProcessEnvError } from './errors/EnvInvalidProcessEnvError'
import { ProcessEnvSchema } from './schemas/ProcessEnvSchema'
import { Environment } from './types/Environment'
import { PubSubType } from './types/PubSubType'
import { PubNubCredentials } from './types/PubNubCredentials'
import { IProcessEnv } from './types/IProcessEnv'

let jsonStringEnv: string | undefined
const envFilePath: string = join(__dirname, './env.json')

try {
    jsonStringEnv = readFileSync(envFilePath, 'utf-8')
} catch (err: unknown) {
    if (err instanceof Error) throw new EnvLoadingError(err.message)
    console.error("Unknown error:", err)
}

// Check if the Loading Env Process string provided is not empty or undefined

if (!isValidString(jsonStringEnv)) throw new EnvInvalidStringError()

// Check if the Loading Env Process string provided a valid JSON

if (!isValidJSON(jsonStringEnv as string)) throw new EnvInvalidJSONError()

// Check if the Loading Env Process provided a valid ProcessEnv

const data: any = JSON.parse(jsonStringEnv as string)

if (!isValidProcessEnv(data)) throw new EnvInvalidProcessEnvError()

// Check if the Loading Env Process provided a valid ProcessEnv using Zod

const ProcessEnvParsed: {
    PORT: string | number
    ENV: Environment
    HOST: string
    PUBSUB_TYPE: PubSubType
    PUBNUB_CONFIG?: PubNubCredentials | undefined
} = ProcessEnvSchema.parse(data)

const { PORT } = ProcessEnvParsed

const ProcessEnvFinal: IProcessEnv = {
    ...ProcessEnvParsed,
    PORT: typeof PORT === 'string' ? PORT : String(PORT)
}

export { ProcessEnvFinal }