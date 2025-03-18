import { ec } from "elliptic"

export interface IInputTransaction {
    getTimestamp(): number
    getAmount(): number
    getAddress(): string
    getSignature(): ec.Signature
}