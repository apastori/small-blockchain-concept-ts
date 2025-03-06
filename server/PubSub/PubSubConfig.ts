import { PubSubPubNub } from "./PubSubPubNub"
import { PubSubRedis } from "./PubSubRedis"

export const PubSubConfig = (credentials?: PubNubConfiguration): PubSubRedis | PubSubPubNub => {
    if (process.env['PUBSUB_TYPE'].toLowerCase() === 'local') {
        return new PubSubRedis()
    }
} 