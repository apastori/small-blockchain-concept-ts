import type { BlockParam } from './types/BlockParam'

const timestamp: Date = new Date()
const lastHash: string = '0'
const hash: string = 'GENESIS_HASH'
const data: string = 'Genesis Data'

export const GENESIS_DATA: BlockParam = {
    timestamp,
    lastHash,
    hash,
    data
}