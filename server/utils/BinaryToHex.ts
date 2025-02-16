import { NoBinaryStringError } from "../errors/NoBinaryString";
import { BinaryFourBits } from "../types/BinaryFourBits";
import { HexDigit } from "../types/HexDigit";
import { isBinaryString } from "./isBinaryStr"

function BinaryToHex(binaryStr: string): string {
    // Validate that the input is a binary string.
    if (isBinaryString(binaryStr)) {
      throw new NoBinaryStringError("Invalid binary string", binaryStr)
    }
    
    // Pad the binary string with leading zeros to make its length a multiple of 4.
    const padLength: number = (4 - (binaryStr.length % 4)) % 4
    binaryStr = "0".repeat(padLength) + binaryStr
  
    let hex: string = ""
    // Process every 4 bits at a time.
    for (let i = 0; i < binaryStr.length; i += 4) {
      const nibble: BinaryFourBits  = binaryStr.substring(i, i + 4) as BinaryFourBits
      const hexDigit: HexDigit = parseInt(nibble, 2).toString(16) as HexDigit
      hex += hexDigit
    }
    return hex
}

export { BinaryToHex }