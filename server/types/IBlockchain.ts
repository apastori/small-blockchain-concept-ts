import { Block } from "../Block"
import { Data } from "./Data"

export interface IBlockchain {
    getChain(): Block[],
    addBlock({ data }: { data: Data}): void
    getLength(): number
}