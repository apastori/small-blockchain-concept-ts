import { Block } from "./Block"
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
        expect(block.getTimestamp()).toEqual(timestamp)
        expect(block.getLastHash()).toEqual(lastHash)
        expect(block.getHash()).toEqual(hash)
        expect(block.getData()).toEqual(data)
    })
})