import { InputTransaction } from "../wallet/InputTransaction"
import { objectStrKeyIntValue } from "./objectStrKeyIntValue"

export interface ITransaction {
    // Getter methods
    getId(): string
    getOutputMap(): objectStrKeyIntValue
    getInput(): InputTransaction
    getOutputMapString(): string
}
