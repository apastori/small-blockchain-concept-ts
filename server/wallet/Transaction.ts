import { PositiveIntegerSchema } from "../schemas/PositiveIntegerSchema"
import { objectStrKeyIntValue } from "../types/objectStrKeyIntValue"
import { TransactionParams } from "../types/TransactionParams"
import { v4 as uuidv4 } from 'uuid'

class Transaction {
    private readonly id: string
    private readonly outputMap: objectStrKeyIntValue
    constructor({ senderWallet, recipient, amount}: TransactionParams) {
        this.id = uuidv4()
        this.outputMap = this.createOutputMap({ senderWallet, recipient, amount})
    }

    getOutputMap(): objectStrKeyIntValue {
        return this.outputMap
    }

    getOutputMapString(): string {
        return JSON.stringify(this.getOutputMap())
    }

    createOutputMap({ senderWallet, recipient, amount}: TransactionParams): objectStrKeyIntValue {
        const outputMap: objectStrKeyIntValue = {}
        if (PositiveIntegerSchema.parse(amount) && PositiveIntegerSchema.parse(senderWallet.getBalance())) {
            outputMap[recipient] = amount
            outputMap[senderWallet.getPublicKey()] = senderWallet.getBalance() - amount
        }
        return outputMap
    } 
}

export { Transaction }