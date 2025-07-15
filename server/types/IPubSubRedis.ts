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
import { Transaction } from '../wallet/Transaction'
import { TransactionPool } from '../wallet/TransactionPool'

export interface IPubSubRedis {
    getBlockchain(): Blockchain
    getTransactinPool(): TransactionPool
    getPublisher(): RedisClientType<RedisModules, RedisFunctions, RedisScripts>
    getSubscriber(): RedisClientType<RedisModules, RedisFunctions, RedisScripts>
    handleMessage(channel: string, message: string): void
    subscribeToChannels(channels: objectStrKeyProp): void
    publishMessage(pubMessage: IPubMessage): void
    broadcastChain(): void
    broadcastTransaction(transaction: Transaction): void
}