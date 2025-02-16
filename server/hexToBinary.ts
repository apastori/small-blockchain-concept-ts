import { NoHexDigitError } from "./errors/NotHexDigitError";
import { BinaryFourBits } from "./types/BinaryFourBits"
import { HexDigit } from "./types/HexDigit"
import { isHexDigit } from "./utils/isHexDigit";

function hexToBinary(hex: string): string {
    const hexString: Array<HexDigit> = Array.from(hex) as Array<HexDigit>
    return hexString.map((char: HexDigit): BinaryFourBits => {
        // Validate that the character is a valid hex digit
        if (!isHexDigit(char)) {
            throw new NoHexDigitError('Invalid hex digit', char)
        }
        const binaryHash: BinaryFourBits = parseInt(char.toLowerCase(), 16).toString(2).padStart(4, '0') as BinaryFourBits
        return binaryHash
    }).join('') as string
}

export { hexToBinary }