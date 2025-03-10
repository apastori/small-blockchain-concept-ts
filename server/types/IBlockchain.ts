import { Block } from "../blockchain/Block"
import { Data } from "./Data"

export interface IBlockchain {
    getChain(): Block[],
    addBlock({ data }: { data: Data}): void,
    getChainLength(): number,
    getChainString(): string,
    getLastBlock(): Block,
    getGenesisBlock(): Block,
    replaceChain(chain: Block[]): void,
    fakeChainGenesisBlock(): Block[],
    fakeChainLastHashBroken(): Block[],
    fakeChainInvalidData(): Block[]
}