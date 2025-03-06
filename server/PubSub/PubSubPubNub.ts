import PubNub, { PubNubConfiguration, Listener, Subscription, Publish} from "pubnub"
import { IPubSubPubNub } from "../types/IPubSubPubNub"
import { objectStrKeyProp } from "../types/objectStrKeyProp"
import { v4 as uuidv4 } from 'uuid'
import { CHANNELS } from "./Channels"
import { credentials } from "./credentials"
import { Blockchain } from "../blockchain/Blockchain"
import { IPubSubPubNubParams } from "../types/IPubSubPubNubParams"
import { isBlock } from "../utils/isBlock"
import { Block } from "../blockchain/Block"

class PubSubPubNub implements IPubSubPubNub {

    private readonly pubnub: PubNub

    private readonly Id: string

    private readonly blockchain: Blockchain

    constructor({ blockchain }: IPubSubPubNubParams) {
        this.blockchain = blockchain
        this.Id = this.generateUserId()
        this.pubnub = new PubNub({
            ...credentials,
            userId: this.getId()
        })
        this.getPubNub().subscribe({
            channels: Object.values(CHANNELS)
        })
        this.getPubNub().addListener(this.getListener())
    }

    getBlockchain(): Blockchain {
        return this.blockchain
    }

    getId(): string {
        return this.Id
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
        this.getPubNub().publish({
            channel, message
        })
    }

    private generateUserId(): string {
        return uuidv4()
    }

    handleMessage(channel: string, message: string): void {
        console.log('Message Received. Channel: ' + channel, 'Message is: ' + message)
        const parsedMessage: string = JSON.parse(message)
        if (!Array.isArray(parsedMessage)) {
            console.log('message is not valid array chain')
            return
        }
        if (!isBlock(parsedMessage)) {
            console.log('one or more elements of array chain are not valid blocks')
            return
        }
        const chainMessage: Block[] = parsedMessage as Block[]
        if (channel === CHANNELS['BLOCKCHAIN']) {
            this.getBlockchain().replaceChain(chainMessage)
        }
    }

    broadcastChain(): void {
        this.publishMessage({
            channel: CHANNELS['BLOCKCHAIN'] as string,
            message: this.getBlockchain().getChainString()
        })
    }

}

// const testPubSubPubNub: PubSubPubNub = new PubSubPubNub(credentials, CHANNELS)

// setTimeout(() => {
//     testPubSubPubNub.publishMessage({ 
//         channel: CHANNELS['TEST']!,
//         message: 'Hello PubNub' 
//     })
// }, 1000)
 
export { PubSubPubNub }