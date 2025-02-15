import { Data } from "./Data"

export interface IBlock {
    getTimestamp(): Date,
    getTimestampString(): string,
    getLastHash(): string,
    getHash(): string,
    getData(): Data,
    getNonce(): number,
    getDifficulty(): number
}