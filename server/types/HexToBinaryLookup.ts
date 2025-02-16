import { BinaryDigit } from "./BinaryDigit"
import { BinaryFourBits } from "./BinaryFourBits"
import { HexDigit } from "./HexDigit"

type HexToBinaryLookupKey = `${HexDigit}`

type HexToBinaryLookupProperty = `${BinaryFourBits}`

export type HexToBinaryLookup = Record<HexToBinaryLookupKey, HexToBinaryLookupProperty>