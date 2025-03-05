import { createClient } from 'redis'
import type { 
    RedisModules, 
    RedisClientType,
    RedisFunctions,
    RedisScripts  
} from 'redis'
import { objectStrKeyProp } from './objectStrKeyProp'
import { IPubMessage } from './IPubMessage'
import { Blockchain } from '../blockchain/Blockchain'

export interface IPubSubRedis {
    getBlockchain(): Blockchain
    getPublisher(): RedisClientType<RedisModules, RedisFunctions, RedisScripts>
    getSubscriber(): RedisClientType<RedisModules, RedisFunctions, RedisScripts>
    handleMessage(channel: string, message: string): void
    subscribeToChannels(channels: objectStrKeyProp): void
    publishMessage(pubMessage: IPubMessage): void
    broadcastChain(): void
}