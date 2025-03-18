import { PositiveIntegerSchema } from "../schemas/PositiveIntegerSchema"
import { objectStrKeyIntValue } from "../types/objectStrKeyIntValue"
import { TransactionParams } from "../types/TransactionParams"
import { v4 as uuidv4 } from 'uuid'
import { Wallet } from "./Wallet"
import { InputTransaction } from "./InputTransaction"

class Transaction {
    private readonly id: string
    private readonly outputMap: objectStrKeyIntValue
    private readonly input: InputTransaction
    constructor({ senderWallet, recipient, amount}: TransactionParams) {
        this.id = uuidv4()
        this.outputMap = this.createOutputMap({ senderWallet, recipient, amount})
        this.input = this.createInput({ senderWallet, outputMap: this.outputMap })
    }

    getOutputMap(): objectStrKeyIntValue {
        return this.outputMap
    }

    getInput(): InputTransaction {
        return this.input
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
    
    createInput({ senderWallet, outputMap}: { 
        senderWallet: Wallet 
        outputMap: objectStrKeyIntValue
    }): InputTransaction {
        return new InputTransaction({
            senderWallet,
            outputMap
        })
    }
}

export { Transaction }