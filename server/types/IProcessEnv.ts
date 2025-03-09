import { Environment } from './Environment'
import { PubNubCredentials } from './PubNubCredentials'
import { PubSubType } from './PubSubType'
import { StringBooleanType } from './StringBooleanType'

export interface IProcessEnv {
    PORT: string
    ENV: Environment
    HOST: string
    PUBSUB_TYPE: PubSubType
    PUBNUB_CONFIG?: string | undefined
    GENERATE_PEER_PORT?: StringBooleanType | undefined
}