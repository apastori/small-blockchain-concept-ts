import { Data } from "./Data"

export interface IBlock {
    getTimestamp(): Date,
    getLastHash(): string,
    getHash(): string,
    getData(): Data
}