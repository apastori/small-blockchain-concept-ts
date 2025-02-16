import { BinaryFourBits } from "./types/BinaryFourBits"
import { HexDigit } from "./types/HexDigit"

function hexToBinary(hex: string): string {
    const hexString: Array<HexDigit> = Array.from(hex) as Array<HexDigit>
    return hexString.map((char: HexDigit): BinaryFourBits => {
        return parseInt(char, 16).toString(2).padStart(4, '0') as BinaryFourBits
    }).join('')
}

export { hexToBinary }