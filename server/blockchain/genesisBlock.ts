import { Block } from './Block'
import { GENESIS_DATA } from './genesisData'

export const GENESIS_BLOCK: Block = new Block({
    ...GENESIS_DATA
})