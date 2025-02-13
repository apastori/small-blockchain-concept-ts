import { Block } from "../Block"
import { Data } from "./Data"

export interface IBlockchain {
    getChain(): Block[],
    addBlock({ data }: { data: Data}): void,
    getChainLength(): number,
    getGenesisBlock(): Block,
    replaceChain(chain: Block[]): void
    fakeChainGenesisBlock(): Block[],
    fakeChainLastHashBroken(): Block[],
    fakeChaininvalidData(): Block[]
}