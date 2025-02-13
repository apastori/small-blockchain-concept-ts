import { Block } from "./Block"
import { Data } from "./types/Data"
import { IBlockchain } from "./types/IBlockchain"
import { GENESIS_DATA } from "./genesisData"
import { randomNumberFakeChain } from "./types/randomNumberFakeChain"
import { cryptoHash } from "./cryptoHash"

class Blockchain implements IBlockchain {
    private chain: Block[]

    constructor() {
        this.chain = [Block.genesis()]
    }
     
    getChain(): Block[] {
        return this.chain
    }

    getChainLength(): number {
        return this.chain.length
    }

    addBlock({ data }: { data: Data }): void {
        const newBlock: Block = Block.mineBlock({
            lastBlock: this.chain[this.chain.length - 1] as Block,
            data
        })
        this.chain.push(newBlock)
    }

    getGenesisBlock(): Block {
        return this.chain[0]!
    }

    replaceChain(chain: Block[]): void {
        if (chain.length <= this.getChainLength()) {
            console.error('new chain is not longer than the current chain')
            return
        }
        if (!Blockchain.isValidChain(chain)) {
            console.error('new chain is not valid')
            return
        }
        console.log('longer and valid new chain', chain)
        this.chain = chain
    }

    fakeChainGenesisBlock(): Block[] {
        const fakeChain: Block[] = this.getChain()
        const { timestamp, lastHash, hash }: 
        { timestamp: Date, lastHash: string, hash: string} = GENESIS_DATA
        fakeChain[0] = new Block({
            timestamp,
            lastHash,
            hash,
            data: 'fake-genesis'
        })
        return fakeChain
    }

    fakeChainLastHashBroken(): Block[] {
        const fakeChain: Block[] = this.getChain()
        const fakeData: string[] = ['Bears', 'Beets', 'Chess']
        const randomNumber1to3: randomNumberFakeChain = Math.floor(Math.random() * 3) + 1 as randomNumberFakeChain
        fakeData.forEach((fakeElement: string, index: number) => {
            if (index === randomNumber1to3) {
                const newBlock: Block = Block.mineFakeBlock(fakeElement)
                fakeChain.push(newBlock)
                return
            }
            const newBlock: Block = Block.mineBlock({
                lastBlock: fakeChain[fakeChain.length - 1] as Block,
                data: fakeElement
            })
            fakeChain.push(newBlock)    
        })
        return fakeChain
    }

    fakeChaininvalidData(): Block[] {
        const fakeChain: Block[] = new Array<Block>()
        const currentChain: Block[] = this.getChain()
        const randomIndex = Math.floor(Math.random() * currentChain.length)
        this.getChain().forEach((block: Block, index: number) => {
            if (index === randomIndex) {
                const newFakeDataBlock = new Block({
                    timestamp: block.getTimestamp(),
                    lastHash: block.getLastHash(),
                    hash: block.getLastHash(),
                    data: 'fake-data'
                })
                fakeChain.push(newFakeDataBlock)
                return
            }
            fakeChain.push(block)    
        })
        return fakeChain
    }

    static isValidChain(chain: Block[]): boolean {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false
        for (let i = 1; i < chain.length; i++) {
            const block: Block = chain[i] as Block
            const correctLastHash: string = chain[i-1]!.getHash()
            const timestamp: Date = block.getTimestamp()
            const lastHash: string = block.getLastHash()
            const hash: string = block.getHash()
            const data: Data = block.getData()
            if (lastHash !== correctLastHash) return false
            const validatedHash: string = cryptoHash(timestamp.toISOString(), lastHash, data)
            if (hash !== validatedHash) return false     
        }
        return true
    }
}

export { Blockchain }