import { Data } from "./Data"

export interface IBlock {
    getTimestamp(): Date,
    getTimestampString(): string,
    getTimestampNumber(): number,
    getLastHash(): string,
    getHash(): string,
    getData(): Data,
    getNonce(): number,
    getDifficulty(): number
}