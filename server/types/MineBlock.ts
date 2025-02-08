import { Block } from "../Block"
import { Data } from "./Data"

export interface MineBlock {
    lastBlock: Block,
    data: Data
}