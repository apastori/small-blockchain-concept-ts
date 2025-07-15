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
import { Transaction } from "../wallet/Transaction"
import { TransactionSchema } from "../schemas/TransactionSchema"
import { TransactionPool } from "../wallet/TransactionPool"

class PubSubPubNub implements IPubSubPubNub {

    private readonly pubnub: PubNub

    private readonly Id: string

    private readonly blockchain: Blockchain

    private readonly transactionPool: TransactionPool

    constructor({ blockchain, credentials, transactionPool }: IPubSubPubNubParams) {
        this.blockchain = blockchain
        this.transactionPool = transactionPool
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
    
    public getBlockchain(): Blockchain {
        return this.blockchain
    }

    public getTransactinPool(): TransactionPool {
        return this.transactionPool
    }

    public getId(): string {
        return this.Id
    }

    public getPubNub(): PubNub {
        return this.pubnub
    }

    public getListener(): Listener {
        const userId: string = this.getId()
        return {
            message: (messageObject: Subscription.Message): void => {
                const { channel, message, publisher } = messageObject
                console.log("userId", userId)
                console.log(messageObject)
                if (publisher === userId) {
                    return
                }
                if (!isString(message)) throw new Error('message is not a valid string')
                this.handleMessage(channel, message as string)
            }
        }
    }

    public publishMessage({ channel, message }: Publish.PublishParameters): void {
        //this.getPubNub().unsubscribe({ channels: [channel]})
        this.getPubNub().publish({
            channel, message
        }, (status: PubNub.Status, _response: Publish.PublishResponse | null) => {
            if (status.error) {
                throw new PubNubPublishError("Error Publish PubNub:" + status.errorData || "General Error")
            }
        })  
    }

    private generateUserId(): string {
        return uuidv4()
    }

    public handleMessage(channel: string, message: string): void {
        console.log('Message Received. Channel: ' + channel, 'Message is: ' + message)
        const parsedMessage: any = JSON.parse(message)
        if (channel === CHANNELS['BLOCKCHAIN']) {
            if (!Array.isArray(parsedMessage)) {
                console.log('message is not valid array chain')
                return
            }
            if (!isBlockArray(parsedMessage)) {
                console.log('one or more elements of array chain are not valid blocks')
                return
            }
            const chainMessage: Block[] = parsedMessage as Block[]
            this.getBlockchain().replaceChain(chainMessage)
            return
        }
        if (channel === CHANNELS['TRANSACTION']) {
            if (!TransactionSchema.safeParse(parsedMessage).success) {
                console.log('message is not valid Transaction')
                return
            }
            const transactionMessage: Transaction = parsedMessage as Transaction
            console.log(transactionMessage)
            this.transactionPool.setTransaction(transactionMessage)
            return
        }
        return
    }

    public broadcastChain(): void {
        this.publishMessage({
            channel: CHANNELS['BLOCKCHAIN'] as string,
            message: this.getBlockchain().getChainString()
        })
    }

    public broadcastTransaction(transaction: Transaction): void {
        this.publishMessage({
            channel: CHANNELS['TRANSACTION'] as string,
            message: transaction.getTransactionString()
        })
    }

    private unsubscribeWithPromise(channels: string[]): Promise<void> {
        const currentPubNub: PubNub = this.getPubNub()
        return new Promise<void>((resolve: (value: void | PromiseLike<void>) => void) => {
          const tempListener: Listener = {
            status: function(statusEvent: PubNub.Status | PubNub.StatusEvent) {
              if (statusEvent.operation && statusEvent.operation === "PNUnsubscribeOperation" &&
                  statusEvent.affectedChannels !== undefined &&
                  !(statusEvent.affectedChannels instanceof Error) &&
                  Array.isArray(statusEvent.affectedChannels)
              ) {
                  if (statusEvent.affectedChannels?.some((ch: any) => channels.includes(ch))) {
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