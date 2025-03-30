import { objectStrKeyTransactionValue } from "../types/objStrKeyTransactionValue"
import { Transaction } from "./Transaction"

class TransactionPool {
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
}

export { TransactionPool }