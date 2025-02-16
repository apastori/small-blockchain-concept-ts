import { HexDigit } from "../types/HexDigit"

export function isHexDigit(char: string): char is HexDigit {
    return /^[0-9A-Fa-f]$/.test(char)
}