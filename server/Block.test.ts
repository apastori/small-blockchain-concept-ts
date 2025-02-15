import { Block } from "./Block"
import { cryptoHash } from "./cryptoHash"
import { GENESIS_BLOCK } from "./genesisBlock"
import { MINE_RATE } from "./mineRate"
import { Data } from "./types/Data"

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
            expect<string>(minedBlock.getHash().substring(0, minedBlock.getDifficulty())).toEqual('0'.repeat(minedBlock.getDifficulty()))
        })
        it('Adjusts the difficulty', () => {
            const possibleResults: number[] = [lastBlock.getDifficulty() + 1, lastBlock.getDifficulty() - 1]
            expect(possibleResults.includes(minedBlock.getDifficulty())).toBe(true)
        })
    })
    
    describe('mineBlock function to mine a Block', () => { 
        it('raises the difficulty for a quickly mined block', () => {
            const timestamp: Date = block.getTimestamp()
            expect(Block.adjustDifficulty(block, timestamp.getTime() + MINE_RATE - 100)).toEqual(block.getDifficulty() + 1)
        })
        it('lowers the difficulty for a quickly mined block', () => {
            const timestamp: Date = block.getTimestamp()
            expect(Block.adjustDifficulty(block, timestamp.getTime() + MINE_RATE + 100)).toEqual(block.getDifficulty() - 1)
        })
    })
})