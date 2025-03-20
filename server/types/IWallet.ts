import { ec } from "elliptic"
import { Data } from "./Data"
import { Transaction } from "../wallet/Transaction"

export interface IWallet {
    // Getter methods
    getBalance(): number
    getPublicKey(): string
    
    // Methods
    sign(data: Data): ec.Signature
    createTransaction({ recipient, amount }: {
        recipient: string
        amount: number
    }): Transaction
}