import { Environment } from './Environment'
import { PubNubCredentials } from './PubNubCredentials'
import { PubSubType } from './PubSubType'

export interface IProcessEnv {
    PORT: string
    ENV: Environment
    HOST: string
    PUBSUB_TYPE: PubSubType
    PUBNUB_CONFIG?: PubNubCredentials | undefined
}