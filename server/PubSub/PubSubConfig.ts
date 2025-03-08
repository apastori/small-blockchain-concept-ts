import { Blockchain } from "../blockchain/Blockchain"
import { PubSubPubNub } from "./PubSubPubNub"
import { PubSubRedis } from "./PubSubRedis"
import { PubNubConfigSchema } from "../schemas/PubNubConfigSchema"
import { PubNubCredentials } from "../types/PubNubCredentials"
import { PubNubConfiguration } from "pubnub"
import { NoConfigPubNubError } from "../errors/NoConfigPubNubError"
import { isValidJSON } from "../utils/isValidJSON"
import { EnvInvalidJSONError } from "../errors/EnvInvalidJSONError"

export const PubSubConfig = (blockchain: Blockchain): PubSubRedis | PubSubPubNub => {
    //Check if Local version Redis is configured
    if (process.env.PUBSUB_TYPE!.toLowerCase() === 'local') {
        return new PubSubRedis({ blockchain })
    }
    if (!process.env.PUBNUB_CONFIG) throw new NoConfigPubNubError()
    if (!isValidJSON(process.env.PUBNUB_CONFIG)) throw new EnvInvalidJSONError()
    const parsedPubSub: PubNubCredentials = PubNubConfigSchema.parse(JSON.parse(process.env.PUBNUB_CONFIG))
    const credentials: PubNubConfiguration = {
        publishKey: parsedPubSub.PUBLISH_KEY,
        subscribeKey: parsedPubSub.SUBSCRIBE_KEY,
        secretKey: parsedPubSub.SECRET_KEY
    }
    // if not local the other option is cloud
    return new PubSubPubNub({ blockchain, credentials })
} 