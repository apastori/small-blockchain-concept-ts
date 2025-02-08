import { Data } from "./types/Data"
import { IBlock } from "./types/IBlock"
import { BlockParam } from "./types/BlockParam"
import { GENESIS_DATA } from './genesisData'
import { MineBlock } from "./types/MineBlock"

class Block implements IBlock {
    private readonly timestamp: Date
    private readonly lastHash: string
    private readonly hash: string 
    private readonly data: Data
    constructor({ timestamp, lastHash, hash, data }: BlockParam) {
        this.timestamp = timestamp
        this.lastHash = lastHash
        this.hash = hash
        this.data = data
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

    static genesis(): Block {
        return new this({ ...GENESIS_DATA })
    }

    static mineBlock({ lastBlock, data }: MineBlock): Block {
        return new this({
            timestamp: new Date(),
            lastHash: lastBlock.hash,
            hash: 'hash',
            data
        })
    } 
}

export { Block }