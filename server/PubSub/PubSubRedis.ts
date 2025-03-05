import { createClient } from 'redis'
import type { 
    RedisModules, 
    RedisClientType,
    RedisFunctions,
    RedisScripts  
} from 'redis'
import { objectStrKeyProp } from '../types/objectStrKeyProp'
import { IPubSubRedis } from '../types/IPubSubRedis'

const Channels: objectStrKeyProp = {
    TEST: 'TEST'
}

class PubSubRedis implements IPubSubRedis {

    private readonly publisher: RedisClientType<RedisModules, RedisFunctions, RedisScripts>

    private readonly subscriber: RedisClientType<RedisModules, RedisFunctions, RedisScripts>

    constructor() {
        this.publisher = createClient<RedisModules, RedisFunctions, RedisScripts>()
        this.subscriber = createClient<RedisModules, RedisFunctions, RedisScripts>()
        this.subscriber.subscribe(Channels['TEST'] as string, (message: string) => {
            console.log('Received message:', message)
        })
        this.subscriber.on('message', (channel: string, message: string) => {
            this.handleMessage(channel, message)
        })
    }

    getPublisher(): RedisClientType<RedisModules, RedisFunctions, RedisScripts> {
        return this.publisher
    }
    
    getSubscriber(): RedisClientType<RedisModules, RedisFunctions, RedisScripts> {
        return this.subscriber
    }

    handleMessage(channel: string, message: string): void {
        console.log('Message Received. Channel: ' + channel, 'Message is: ' + message)
    }
}

const testPubSub: PubSubRedis = new PubSubRedis()

setTimeout(() => testPubSub.getPublisher().publish(Channels['TEST'] as string, 'foo'), 1000)

export { PubSubRedis }