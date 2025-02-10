import { Block } from "./Block"
import { cryptoHash } from "./cryptoHash"
import { GENESIS_BLOCK } from "./genesisBlock"
import { Data } from "./types/Data"

describe('Block', () => {
    const timestamp: Date = new Date()
    const lastHash: string = 'foo-hash'
    const hash: string = 'bar-hash'
    const data: Data = {
        blockchain: 'blockchain',
        data: 'data' 
    }
    const block: Block = new Block({
        timestamp,
        lastHash,
        hash,
        data
    })
    it('Block has a timestamp, lastHash, hash and data property', () => {
        expect<Date>(block.getTimestamp()).toEqual(timestamp)
        expect<string>(block.getLastHash()).toEqual(lastHash)
        expect<string>(block.getHash()).toEqual(hash)
        expect<Data>(block.getData()).toEqual(data)
    })
})

describe('genesis static function from Block class', () => {
    const genesisBlock: Block = Block.genesis()
    it('returns a Block instance', () => {
        expect<boolean>(genesisBlock instanceof Block).toBe(true)
    })
    it('returns the genesis data', () => {
        expect<Block>(genesisBlock).toStrictEqual(GENESIS_BLOCK)
    })
})

describe('mineBlock function to mine a Block', () => {
    const lastBlock: Block = Block.genesis()
    const data: string = 'mined data'
    const minedBlock: Block = Block.mineBlock({ lastBlock, data })
    it('returns a Block instance', () => {
        expect<boolean>(minedBlock instanceof Block).toBe(true)
    })
    it('sets tbe lastHash to be the hash of the last block', () => {
        expect<string>(minedBlock.getLastHash()).toEqual(lastBlock.getHash())
    })
    it('sets tbe data', () => {
        expect<Data>(minedBlock.getData()).toEqual(data)
    })
    it('sets a timestamp', () => {
        expect<Date>(minedBlock.getTimestamp()).not.toEqual(undefined)
    })
    it('Creates a SHA3-256 `hash` based on the proper inputs', () => {
        expect<string>(minedBlock.getHash()).toEqual(cryptoHash(minedBlock.getTimestampString(), lastBlock.getHash(), data))
    })
})