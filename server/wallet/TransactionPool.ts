import { object } from "zod"
import { objectStrKeyTransactionValue } from "../types/objStrKeyTransactionValue"
import { Transaction } from "./Transaction"
import { ITransactionPool } from "../types/ITransactionPool"

class TransactionPool implements ITransactionPool {
    private readonly transactionMap: objectStrKeyTransactionValue
    constructor() {
        this.transactionMap = {}
    }
    public getTransactionMap(): objectStrKeyTransactionValue {
        return this.transactionMap
    }
    public setTransaction(transaction: Transaction): void {
        this.transactionMap[transaction.getId()] = transaction
    }
    public existingTransaction({ inputAddress }: { inputAddress: string}): Transaction | undefined {
        const transactions: Transaction[] = Object.values(this.getTransactionMap())
        return transactions.find((transaction: Transaction) => {
            return transaction.getInput().getAddress() === inputAddress
        })
    }
}

export { TransactionPool }