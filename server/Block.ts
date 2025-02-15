import { Data } from "./types/Data"
import { IBlock } from "./types/IBlock"
import { BlockParam } from "./types/BlockParam"
import { GENESIS_DATA } from './genesisData'
import { MineBlock } from "./types/MineBlock"
import { cryptoHash } from "./cryptoHash"
import { MINE_RATE } from "./mineRate"

class Block implements IBlock {
    private readonly timestamp: Date
    private readonly lastHash: string
    private readonly hash: string 
    private readonly data: Data
    private readonly nonce: number
    private readonly difficulty: number
    constructor({ timestamp, lastHash, hash, data, nonce, difficulty }: BlockParam) {
        this.timestamp = timestamp
        this.lastHash = lastHash
        this.hash = hash
        this.data = data
        this.nonce = nonce
        this.difficulty = difficulty
    }
    getTimestampString(): string {
        return this.timestamp.toISOString()
    }
    getTimestamp(): Date {
        return this.timestamp
    }
    getLastHash(): string {
        return this.lastHash
    }
    getHash(): string {
        return this.hash
    }
    getData(): Data {
        return this.data
    }

    getNonce(): number {
        return this.nonce
    }
    getDifficulty(): number {
        return this.difficulty
    }

    static genesis(): Block {
        return new this({ ...GENESIS_DATA })
    }

    static mineBlock({ lastBlock, data }: MineBlock): Block {
        let hash: string
        let timestamp: Date
        const lastHash: string = lastBlock.getHash()
        let difficulty: number = lastBlock.getDifficulty()
        let nonce: number = 0
        do {
            nonce++
            timestamp = new Date()
            difficulty = Block.adjustDifficulty(lastBlock, timestamp.getTime())
            hash = cryptoHash(timestamp.toISOString(), lastHash, data, String(nonce), String(difficulty))
        } while (hash?.substring(0, difficulty) !== '0'.repeat(difficulty))
        return new this({
            timestamp,
            lastHash,
            data,
            difficulty,
            nonce,
            hash
        })
    }
    
    static mineFakeBlock({ lastBlock, data }: MineBlock): Block {
        let hash: string
        let timestamp: Date
        const lastHash: string = 'fake-hash'
        const difficulty: number = lastBlock.getDifficulty()
        let nonce: number = 0
        do {
            nonce++
            timestamp = new Date()
            hash = cryptoHash(timestamp.toISOString(), lastHash, data, String(nonce), String(difficulty))
        } while (hash?.substring(0, difficulty) !== '0'.repeat(difficulty))
        return new this({
            timestamp,
            lastHash,
            data,
            hash,
            difficulty,
            nonce
        })
    }
    
    static adjustDifficulty(originalBlock: Block, timestamp: number): number {
        const difficulty: number = originalBlock.getDifficulty()
        const difference: number = timestamp - originalBlock.getTimestamp().getTime()
        if (difference > MINE_RATE) return difficulty - 1
        return difficulty + 1
    }

}

export { Block }