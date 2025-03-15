import PubNub, { PubNubConfiguration, Listener, Subscription, Publish} from "pubnub"
import { IPubSubPubNub } from "../types/IPubSubPubNub"
import { v4 as uuidv4 } from 'uuid'
import { CHANNELS } from "./Channels"
import { Blockchain } from "../blockchain/Blockchain"
import { IPubSubPubNubParams } from "../types/IPubSubPubNubParams"
import { Block } from "../blockchain/Block"
import { isString } from "../utils/isString"
import { isBlockArray } from "../utils/isBlockArray"
import { PubNubPublishError } from "../errors/PubNubPublishError"

class PubSubPubNub implements IPubSubPubNub {

    private readonly pubnub: PubNub

    private readonly Id: string

    private readonly blockchain: Blockchain

    constructor({ blockchain, credentials }: IPubSubPubNubParams) {
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
                if (!isString(message)) throw new Error('message is not a valid string')
                this.handleMessage(channel, message as string)
            }
        }
    }

    publishMessage({ channel, message }: Publish.PublishParameters): void {
        //this.getPubNub().unsubscribe({ channels: [channel]})
        this.unsubscribeWithPromise([channel])
            .then(() => {
                this.getPubNub().publish({
                    channel, message
                }, (status: PubNub.Status, _response: Publish.PublishResponse | null) => {
                    if (status.error) {
                        throw new PubNubPublishError("Error Publish PubNub:" + status.errorData || "General Error")
                    }
                    console.log("Subscribe again to channel")
                    this.getPubNub().subscribe({
                        channels: [channel]
                    })
                })  
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
        console.log(typeof parsedMessage, parsedMessage)
        if (!isBlockArray(parsedMessage)) {
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

    unsubscribeWithPromise(channels: string[]): Promise<void> {
        const currentPubNub: PubNub = this.getPubNub()
        return new Promise<void>((resolve: (value: void | PromiseLike<void>) => void) => {
          const tempListener: Listener = {
            status: function(statusEvent: PubNub.Status | PubNub.StatusEvent) {
              console.log("Status event operation:", statusEvent.operation)
              console.log("Status event category:", statusEvent.category)
              console.log(typeof statusEvent, statusEvent)  
              console.log(typeof statusEvent.affectedChannels, statusEvent.affectedChannels)
              if (statusEvent.operation && statusEvent.operation === "PNUnsubscribeOperation" &&
                  statusEvent.affectedChannels !== undefined &&
                  !(statusEvent.affectedChannels instanceof Error) &&
                  Array.isArray(statusEvent.affectedChannels)
              ) {
                  if (statusEvent.affectedChannels?.some((ch: any) => channels.includes(ch))) {
                    console.log("executes resolve")
                    currentPubNub.removeListener(tempListener)
                    resolve()
                  }
                } else {
                    console.log("not validation affectedMessages")
                }
            }
          }
          currentPubNub.addListener(tempListener)
          currentPubNub.unsubscribe({channels: channels})
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