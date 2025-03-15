import type { BlockParam } from '../types/BlockParam'

//Genesis Date is the Unix Epoch
const timestamp: Date = new Date("1970-01-01T00:00:00Z")
const lastHash: string = '0'
const hash: string = 'GENESIS_HASH'
const data: string = 'Genesis Data'
const difficulty: number = 3

export const GENESIS_DATA: BlockParam = {
    timestamp,
    lastHash,
    hash,
    data,
    difficulty,
    nonce: 0
}