import { Block } from "./Block"
import { Blockchain } from "./Blockchain"
import { GENESIS_BLOCK } from "./genesisBlock"
import { Data } from "./types/Data"

describe('Blockchain', () => {
    let blockchain: Blockchain, newChain: Blockchain
    let originalChain: Blockchain
    beforeEach(() => {
        blockchain = new Blockchain()
        newChain = new Blockchain()
        originalChain = blockchain
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
                    const fakeChainLastHash: Block[] = fakeChain.fakeChainLastHashBroken()
                    expect<boolean>(Blockchain.isValidChain(fakeChainLastHash)).toBe(false)
                })
            })
            describe('and the chain contains a block with an invalid field',  () => {
                it('returns false', () => {
                    expect<boolean>(Blockchain.isValidChain(fakeChain.fakeChainInvalidData())).toBe(false)
                })
            })
            describe('and the chain does not contain any invalid blocks',  () => {
                it('returns true', () => {
                    expect<boolean>(Blockchain.isValidChain(fakeChain.getChain())).toBe(true)
                })
            })
        })
    })
    describe('replaceChain method works to create a replacement current chain', () => {
        let errorMock: jest.Mock, logMock: jest.Mock
        beforeEach(() => {
            errorMock = jest.fn()
            logMock = jest.fn()
            global.console.error = errorMock
            global.console.log = logMock
        })
        describe('when the new chain is not longer',  () => {
            beforeEach(() => {
                blockchain.replaceChain(newChain.fakeChainInvalidData())
            })
            it('it does not replace the chain', () => {
                expect<Block[]>(blockchain.getChain()).toEqual(originalChain.getChain())
            })
            it('logs an error', () => {
                expect(errorMock).toHaveBeenCalled()
            })
        })
        describe('when the new chain is in fact longer',  () => {
            beforeEach(() => {
                newChain.addBlock({ data: 'test1'})
                newChain.addBlock({ data: 'test2'})
                newChain.addBlock({ data: 'test3'})
            })
            describe('and the chain is invalid', () => {
                beforeEach(() => {
                    blockchain.replaceChain(newChain.fakeChainLastHashBroken())
                })
                it('it does not replace the new chain', () => {
                    expect<Block[]>(blockchain.getChain()).toEqual(originalChain.getChain())
                })
                it('logs an error', () => {
                    expect(errorMock).toHaveBeenCalled()
                })
            })
            describe('and the chain is valid', () => {
                beforeEach(() => {
                    blockchain.replaceChain(newChain.getChain())
                })
                it('replaces the chain', () => {
                    expect<Block[]>(blockchain.getChain()).toEqual(newChain.getChain())
                })
                it('logs about the chain replacement', () => {
                    expect(logMock).toHaveBeenCalled()
                })
            })
        })
    })
})
