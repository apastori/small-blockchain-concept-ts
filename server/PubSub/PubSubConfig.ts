import { Blockchain } from "../blockchain/Blockchain"
import { PubSubPubNub } from "./PubSubPubNub"
import { PubSubRedis } from "./PubSubRedis"
import { PubNubConfigSchema } from "../schemas/PubNubConfigSchema"
import { PubNubCredentials } from "../types/PubNubCredentials"
import { PubNubConfiguration } from "pubnub"

export const PubSubConfig = (blockchain: Blockchain): PubSubRedis | PubSubPubNub => {
    //Check if Local version Redis is configured
    if (process.env.PUBSUB_TYPE!.toLowerCase() === 'local') {
        return new PubSubRedis({ blockchain })
    }
    console.log('SubPugConfig', process.env)
    console.log(process.env.HOST, process.env.ENV)
    console.log(Object.keys(process.env).includes('PUBNUB_CONFIG'))
    console.log(process.env.PUBNUB_CONFIG)
    const parsedPubSub: PubNubCredentials = PubNubConfigSchema.parse(process.env.PUBNUB_CONFIG || {})
    const credentials: PubNubConfiguration = {
        publishKey: parsedPubSub.PUBLISH_KEY,
        subscribeKey: parsedPubSub.SUBSCRIBE_KEY,
        secretKey: parsedPubSub.SECRET_KEY
    }
    // if not local the other option is cloud
    return new PubSubPubNub({ blockchain, credentials })
} 