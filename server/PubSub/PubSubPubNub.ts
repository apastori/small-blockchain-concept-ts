import PubNub, { PubNubConfiguration, Listener, Subscription, Publish} from "pubnub"
import { IPubSubPubNub } from "../types/IPubSubPubNub"
import { objectStrKeyProp } from "../types/objectStrKeyProp"
import { v4 as uuidv4 } from 'uuid'

const credentials: PubNubConfiguration = {
    publishKey: 'pub-c-cd4ec89b-ba1d-441a-b9c3-3d55cb74d7e7',
    subscribeKey: 'sub-c-5a61b0eb-e431-40b9-8ad5-a4e5e48f4527',
    secretKey: 'sec-c-MGJjODUwZDMtNTU1MS00YTA4LWE3YzctNzRkZDU2NzZjZjA3'
}

const Channels: objectStrKeyProp = {
    TEST: 'TEST'
}

class PubSubPubNub implements IPubSubPubNub {

    private readonly pubnub: PubNub

    constructor(credentials: PubNubConfiguration, channels: objectStrKeyProp) {
        this.pubnub = new PubNub({
            ...credentials,
            userId: this.generateUserId()
        })
        this.pubnub.subscribe({
            channels: Object.values(channels)
        })
        this.pubnub.addListener(this.getListener())
    }

    getPubNub(): PubNub {
        return this.pubnub
    }

    getListener(): Listener {
        return {
            message: (messageObject: Subscription.Message): void => {
                const { channel, message } = messageObject
                console.log(`Message Received. Channel: ${channel}`)
                console.log(`Message: ${message}`)
            }
        }
    }

    publishMessage({ channel, message }: Publish.PublishParameters): void {
        this.pubnub.publish({
            channel, message
        })
    }

    generateUserId(): string {
        return uuidv4()
    }

}

const testPubSubPubNub: PubSubPubNub = new PubSubPubNub(credentials, Channels)

setTimeout(() => {
    testPubSubPubNub.publishMessage({ 
        channel: Channels['TEST']!,
        message: 'Hello PubNub' 
    })
}, 1000)

export { PubSubPubNub }