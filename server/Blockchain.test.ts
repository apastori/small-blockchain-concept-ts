import { Block } from "./Block"
import { Blockchain } from "./Blockchain"
import { GENESIS_BLOCK } from "./genesisBlock"
import { Data } from "./types/Data"

describe('Blockchain', () => {
    const blockchain: Blockchain = new Blockchain()
    it('contains a `chain` Array instance', () => {
        expect<boolean>(blockchain.getChain() instanceof Array).toBe(true)
    })
    it('starts with the genesis block', () => {
        expect<Block>(blockchain.getChain()[0] as Block).toStrictEqual(GENESIS_BLOCK)
    })
    it('adds a new block to the chain', () => {
        const newData: Data = 'foo bar'
        blockchain.addBlock({ data: newData })
        const lastBlock: Block = blockchain.getChain()[blockchain.getChain().length - 1] as Block
        expect<Data>(lastBlock['data']).toEqual(newData)
    })
})
