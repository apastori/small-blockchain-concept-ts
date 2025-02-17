import { Block } from "../blockchain/Block"
import { Data } from "./Data"

export interface MineBlock {
    lastBlock: Block,
    data: Data
}