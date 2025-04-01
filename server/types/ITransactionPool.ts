import { Transaction } from "../wallet/Transaction"
import { objectStrKeyTransactionValue } from "./objStrKeyTransactionValue"

export interface ITransactionPool {
    getTransactionMap(): objectStrKeyTransactionValue
    setTransaction(transaction: Transaction): void
    existingTransaction({ inputAddress }: { inputAddress: string}): Transaction | undefined
}