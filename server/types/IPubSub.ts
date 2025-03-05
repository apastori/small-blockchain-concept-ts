import { createClient } from 'redis'
import type { 
    RedisModules, 
    RedisClientType,
    RedisFunctions,
    RedisScripts  
} from 'redis'

export interface IPubSub {
    getPublisher(): RedisClientType<RedisModules, RedisFunctions, RedisScripts>
    getSubscriber(): RedisClientType<RedisModules, RedisFunctions, RedisScripts>
    handleMessage(channel: string, message: string): void
}