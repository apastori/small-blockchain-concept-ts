import { Block } from "./Block"
import { cryptoHash } from "../utils/cryptoHash"
import { cryptoHashBinary } from "../utils/cryptoHashBinary"
import { GENESIS_BLOCK } from "./genesisBlock"
import { hexToBinary } from "../utils/hexToBinary"
import { MINE_RATE } from "./mineRate"
import { Data } from "../types/Data"

describe('Block', () => {
    const timestamp: Date = new Date()
    const lastHash: string = 'foo-hash'
    const hash: string = 'bar-hash'
    const data: Data = {
        blockchain: 'blockchain',
        data: 'data' 
    }
    const nonce: number = 1
    const difficulty: number = 1
    const block: Block = new Block({
        timestamp,
        lastHash,
        hash,
        data,
        nonce,
        difficulty
    })
    it('Block has a timestamp, lastHash, hash, data, nonce, difficulty property', () => {
        expect<Date>(block.getTimestamp()).toEqual(timestamp)
        expect<string>(block.getLastHash()).toEqual(lastHash)
        expect<string>(block.getHash()).toEqual(hash)
        expect<Data>(block.getData()).toEqual(data)
        expect<number>(block.getNonce()).toEqual(nonce)
        expect<number>(block.getDifficulty()).toEqual(difficulty)
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
            expect<string>(minedBlock.getHash()).toEqual(
                cryptoHash(
                    minedBlock.getTimestampString(),
                    String(minedBlock.getNonce()),
                    String(minedBlock.getDifficulty()),  
                    lastBlock.getHash(), 
                    data
                )
            )
        })
        it('Sets a `hash` that matches the difficulty criteria', () => {
            expect<string>(hexToBinary(minedBlock.getHash()).substring(0, minedBlock.getDifficulty())).toEqual('0'.repeat(minedBlock.getDifficulty()))
        })
        it('Adjusts the difficulty Function to dynamically regulate the difficulty of the Blockchain at any given moment', () => {
            const possibleResults: number[] = [lastBlock.getDifficulty() + 1, lastBlock.getDifficulty() - 1]
            expect<boolean>(possibleResults.includes(minedBlock.getDifficulty())).toBe(true)
        })
        it('the hex-to-binary tool and the hex-to-binary-lookup return the same result', () => {
            expect<string>(hexToBinary(minedBlock.getHash())).toEqual(
                cryptoHashBinary(
                    minedBlock.getTimestampString(),
                    String(minedBlock.getNonce()),
                    String(minedBlock.getDifficulty()),  
                    minedBlock.getLastHash(), 
                    minedBlock.getData()
                )
            )
        })
    })
    
    describe('mineBlock function to mine a Block', () => { 
        it('raises the difficulty for a quickly mined block', () => {
            const timestamp: Date = block.getTimestamp()
            expect<number>(Block.adjustDifficulty(block, timestamp.getTime() + MINE_RATE - 100)).toEqual(block.getDifficulty() + 1)
        })
        it('lowers the difficulty for a quickly mined block', () => {
            const timestamp: Date = block.getTimestamp()
            expect<number>(Block.adjustDifficulty(block, timestamp.getTime() + MINE_RATE + 100)).toEqual(block.getDifficulty() - 1)
        })
        it('has a lower limit of 1', () => {
            const timestamp_: Date = block.getTimestamp()
            const hash_: string = block.getHash()
            const lastHash_: string = block.getLastHash()
            const data_: Data = block.getData()
            const nonce_: number = block.getNonce()
            const difficulty_: -1 = -1
            const newBlock: Block = new Block({
                timestamp: timestamp_,
                lastHash: lastHash_,
                hash: hash_,
                data: data_,
                nonce: nonce_,
                difficulty: difficulty_
            })
            expect<number>(Block.adjustDifficulty(newBlock, Date.now())).toEqual(1)
        })
    })
})