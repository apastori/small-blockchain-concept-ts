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

class PubSubRedis implements IPubSubRedis {

    private readonly publisher: RedisClientType<RedisModules, RedisFunctions, RedisScripts>

    private readonly subscriber: RedisClientType<RedisModules, RedisFunctions, RedisScripts>

    private readonly blockchain: Blockchain

    constructor({ blockchain }: { blockchain: Blockchain }) {
        this.blockchain = blockchain
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
    
    getBlockchain(): Blockchain {
        return this.blockchain
    }
    
    getPublisher(): RedisClientType<RedisModules, RedisFunctions, RedisScripts> {
        return this.publisher
    }
    
    getSubscriber(): RedisClientType<RedisModules, RedisFunctions, RedisScripts> {
        return this.subscriber
    }

    handleMessage(channel: string, message: string): void {
        console.log('Message Received. Channel: ' + channel, 'Message is: ' + message)
        const parsedMessage: string = JSON.parse(message)
        if (!Array.isArray(parsedMessage)) {
            console.log('message is not valid array chain')
            return
        }
        if (!isBlockArray(parsedMessage)) {
            console.log('one or more elements of array chain are not valid blocks')
            return
        }
        const chainMessage: Block[] = parsedMessage as Block[]
        if (channel === CHANNELS['BLOCKCHAIN']) {
            this.getBlockchain().replaceChain(chainMessage)
        }
    }

    subscribeToChannels(channels: objectStrKeyProp): void {
        Object.values(channels).forEach((channel: string) => {
            this.subscriber.subscribe(channel, (message: string) => {
                console.log('Received message:', message)
            })
        })
    }

    publishMessage({ channel, message }: IPubMessage): void {
        this.getPublisher().publish(channel, message)
    }

    broadcastChain(): void {
        this.publishMessage({
            channel: CHANNELS['BLOCKCHAIN'] as string,
            message: this.getBlockchain().getChainString()
        })
    }

}

//const testPubSub: PubSubRedis = new PubSubRedis(CHANNELS)

//setTimeout(() => testPubSub.getPublisher().publish(CHANNELS['TEST'] as string, 'foo'), 1000)

export { PubSubRedis }