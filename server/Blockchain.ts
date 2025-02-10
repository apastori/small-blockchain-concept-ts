import { Block } from "./Block";
import { Data } from "./types/Data";
import { IBlockchain } from "./types/IBlockchain"

class Blockchain implements IBlockchain {
    private chain: Block[]

    constructor() {
        this.chain = [Block.genesis()]
    }
    getChain(): Block[] {
        return this.chain
    }
    getLength(): number {
        return this.chain.length
    }
    addBlock({ data }: { data: Data; }): void {
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[this.chain.length - 1] as Block,
            data
        })
        this.chain.push(newBlock)
    }
}

export { Blockchain }