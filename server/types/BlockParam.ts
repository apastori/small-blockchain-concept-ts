import { Data } from "./Data"

export interface BlockParam {
    timestamp: Date,
    lastHash: string,
    hash: string,
    data: Data,
    nonce: number,
    difficulty: number
}