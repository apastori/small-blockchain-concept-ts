import { Block } from "./Block"
import { Blockchain } from "./Blockchain"
import { GENESIS_BLOCK } from "./genesisBlock"
import { Data } from "./types/Data"

describe('Blockchain', () => {
    let blockchain: Blockchain
    beforeEach(() => {
        blockchain = new Blockchain() // Ensure a fresh instance for every test
    })
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
    describe('isValidChain method works to check validation of chain', () => {
        let fakeChain: Blockchain
        beforeEach(() => {
            fakeChain = new Blockchain()
            fakeChain.addBlock({ data: 'test1'})
            fakeChain.addBlock({ data: 'test2'})
            fakeChain.addBlock({ data: 'test3'})
        })
        describe('When the chain does not start with the genesis block', () => {
            it('returns false',  () => {
                expect<boolean>(Blockchain.isValidChain(fakeChain.fakeChainGenesisBlock())).toBe(false)
            })
        })
        describe('When the chain starts with the genesis block and has multiple blocks', () => {
            describe('and a lastHash reference has changes',  () => {
                it('returns false', () => {
                    expect<boolean>(Blockchain.isValidChain(fakeChain.fakeChainLastHashBroken())).toBe(false)
                })
            })
            describe('and the chain contains a block with an invalid field',  () => {
                it('returns false', () => {
                    expect<boolean>(Blockchain.isValidChain(fakeChain.fakeChaininvalidData())).toBe(false)
                })
            })
            describe('and the chain does not contain any invalid blocks',  () => {
                it('returns true', () => {
                    expect<boolean>(Blockchain.isValidChain(fakeChain.getChain())).toBe(true)
                })
            })
        })
    })
})
