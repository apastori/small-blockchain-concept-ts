import { Block } from "./Block"
import { Data } from "./types/Data"
import { IBlockchain } from "./types/IBlockchain"
import { GENESIS_DATA } from "./genesisData"
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

    getLastBlock(): Block {
        return this.getChain()[this.getChainLength() - 1] as Block
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
        const { timestamp, lastHash, hash, nonce, difficulty }: 
        { timestamp: Date, lastHash: string, hash: string, nonce: number, difficulty: number } = GENESIS_DATA
        fakeChain[0] = new Block({
            timestamp,
            lastHash,
            hash,
            data: 'fake-genesis',
            nonce,
            difficulty
        })
        return fakeChain
    }

    fakeChainLastHashBroken(): Block[] {
        const fakeChain: Block[] = new Array<Block>()
        const currentChain: Block[] = this.getChain()
        if (currentChain.length === 1) {
            const fakeData: string[] = ['Bears', 'Beets', 'Chess']
            fakeData.forEach((fakeElement: string) => {
                const newBlock: Block = Block.mineBlock({
                    lastBlock: currentChain[currentChain.length - 1] as Block,
                    data: fakeElement
                })
                currentChain.push(newBlock)    
            })
        }
        const randomIndex: number = Math.floor(Math.random() * (currentChain.length - 1)) + 1
        currentChain.forEach((block: Block, index: number) => {
            if (index === randomIndex) {
                const newBlock = new Block({
                    timestamp: block.getTimestamp(),
                    lastHash: 'fake-hash',
                    hash: block.getHash(),
                    data: block.getData(),
                    nonce: block.getNonce(),
                    difficulty: block.getDifficulty()
                })
                fakeChain.push(newBlock)
                return
            }
            fakeChain.push(block)
        })    
        return fakeChain
    }

    fakeChainInvalidData(): Block[] {
        const fakeChain: Block[] = new Array<Block>()
        const currentChain: Block[] = this.getChain()
        const randomIndex: number = Math.floor(Math.random() * (currentChain.length - 1)) + 1
        this.getChain().forEach((block: Block, index: number) => {
            if (index === randomIndex) {
                const newFakeDataBlock = new Block({
                    timestamp: block.getTimestamp(),
                    lastHash: block.getLastHash(),
                    hash: block.getHash(),
                    nonce: block.getNonce(),
                    difficulty: block.getDifficulty(),
                    data: 'fake-data'
                })
                fakeChain.push(newFakeDataBlock)
                return
            }
            fakeChain.push(block)    
        })
        return fakeChain
    }

    fakeChainJumpedDifficulty(): Block[] {
        const fakeChain: Block[] = new Array<Block>()
        const currentChain: Block[] = this.getChain()
        const randomIndex: number = Math.floor(Math.random() * (currentChain.length - 1)) + 1
        this.getChain().forEach((block: Block, index: number) => {
            if (index === randomIndex) {
                const lastBlock: Block = fakeChain[fakeChain.length - 1]! as Block
                const lastHash: string = lastBlock.getHash()
                const timestamp: Date = new Date()
                const nonce: number = lastBlock.getNonce()
                const data: Data = 'jumped-difficulty-data'
                const difficulty: number = lastBlock.getDifficulty() - 3
                const hash: string = cryptoHash(timestamp.toISOString(), lastHash, String(lastBlock.getDifficulty()), String(nonce), data)
                const badBlock: Block = new Block({
                    timestamp,
                    lastHash,
                    hash,
                    nonce,
                    difficulty,
                    data 
                })
                fakeChain.push(badBlock)
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
            const lastDifficulty: number = chain[i-1]!.getDifficulty()
            const timestamp: Date = block.getTimestamp()
            const lastHash: string = block.getLastHash()
            const hash: string = block.getHash()
            const data: Data = block.getData()
            const nonce: number = block.getNonce()
            const difficulty: number = block.getDifficulty()
            if (lastHash !== correctLastHash) return false
            const validatedHash: string = cryptoHash(timestamp.toISOString(), lastHash, data, String(nonce), String(difficulty))
            if (hash !== validatedHash) return false
            if (Math.abs(lastDifficulty - difficulty) > 1) return false 
        }
        return true
    }
}

export { Blockchain }