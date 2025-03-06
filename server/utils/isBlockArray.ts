import { isBlock } from "./isBlock"

export function isBlockArray(arr: any[]): boolean {
    return arr.every(isBlock)
}