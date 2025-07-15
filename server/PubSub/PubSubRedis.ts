import { createClient } from 'redis'
import type { 
    RedisModules, 
    RedisClientType,
    RedisFunctions,
    RedisScripts  
} from 'redis'
import { objectStrKeyProp } from '../types/objectStrKeyProp'
import { IPubSubRedis } from '../types/IPubSubRedis'
import { RedisPublisherError } from '../errors/RedisPublisherError'
import { RedisSubscriberError } from '../errors/RedisSubscriberError'
import { IPubMessage } from '../types/IPubMessage'
import { Blockchain } from '../blockchain/Blockchain'
import { Block } from '../blockchain/Block'
import { CHANNELS } from './Channels'
import { isBlockArray } from '../utils/isBlockArray'
import { TransactionPool } from '../wallet/TransactionPool'
import { Transaction } from '../wallet/Transaction'
import { TransactionSchema } from '../schemas/TransactionSchema'

class PubSubRedis implements IPubSubRedis {

    private readonly publisher: RedisClientType<RedisModules, RedisFunctions, RedisScripts>

    private readonly subscriber: RedisClientType<RedisModules, RedisFunctions, RedisScripts>

    private readonly blockchain: Blockchain

    private readonly transactionPool: TransactionPool

    constructor({ blockchain, transactionPool }: { 
        blockchain: Blockchain,
        transactionPool: TransactionPool
     }) {
        this.blockchain = blockchain
        this.transactionPool = transactionPool
        this.publisher = createClient<RedisModules, RedisFunctions, RedisScripts>()
        this.subscriber = createClient<RedisModules, RedisFunctions, RedisScripts>()
        this.subscribeToChannels(CHANNELS)
        this.getSubscriber().on('message', (channel: string, message: string) => {
            this.handleMessage(channel, message)
        })
        // You can also handle errors like this
        this.getPublisher().on("error", (err: Error) => {
            console.error(`Redis error [${err.name}]:`, err.message)
            throw new RedisPublisherError(err.message) 
        })
        this.getSubscriber().on("error", (err: Error) => {
            console.error(`Redis error [${err.name}]:`, err.message)
            throw new RedisSubscriberError(err.message)    
        })
    }
    
    public getBlockchain(): Blockchain {
        return this.blockchain
    }

    public getTransactinPool(): TransactionPool {
        return this.transactionPool
    }
    
    public getPublisher(): RedisClientType<RedisModules, RedisFunctions, RedisScripts> {
        return this.publisher
    }
    
    public getSubscriber(): RedisClientType<RedisModules, RedisFunctions, RedisScripts> {
        return this.subscriber
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
            this.getTransactinPool().setTransaction(transactionMessage)
            return
        }
        return
    }

    public subscribeToChannels(channels: objectStrKeyProp): void {
        Object.values(channels).forEach((channel: string) => {
            this.getSubscriber().subscribe(channel, (message: string) => {
                console.log('Received message:', message)
            })
        })
    }

    public publishMessage({ channel, message }: IPubMessage): void {
        this.getSubscriber().unsubscribe(channel, () => {
            this.getPublisher().publish(channel, message)
                .then(() => {
                    console.log("Message published successfully!")
                    this.getSubscriber().subscribe(channel, (_) => {
                        console.log('Listening for changes')
                    })
                })
                .catch(console.error)
        })
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

}

//const testPubSub: PubSubRedis = new PubSubRedis(CHANNELS)

//setTimeout(() => testPubSub.getPublisher().publish(CHANNELS['TEST'] as string, 'foo'), 1000)

export { PubSubRedis }