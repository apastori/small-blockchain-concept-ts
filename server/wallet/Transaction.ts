import { PositiveIntegerSchema } from "../schemas/PositiveIntegerSchema"
import { objectStrKeyIntValue } from "../types/objectStrKeyIntValue"
import { TransactionParams } from "../types/TransactionParams"
import { v4 as uuidv4 } from 'uuid'
import { Wallet } from "./Wallet"
import { InputTransaction } from "./InputTransaction"
import { verifySignature } from "../utils/verifySignature"
import { convertNumberValuesToString } from "../utils/convertNumberValuesToString"
import { Data } from "../types/Data"

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

    static fakeTransactionInvalidPublicKey(transaction: Transaction, senderWallet: Wallet): Transaction {
        const outputAmount: objectStrKeyIntValue = transaction.getOutputMap()
        const publicKeyKey: string = transaction.getInput().getAddress()
        const outputMapKeys: string[] = Object.keys(outputAmount)
        let recipient: string = ''
        let amount: number = 0
        if (outputMapKeys.length === 2) {
            const filteredKeys: string[] = outputMapKeys.filter(key => key !== publicKeyKey)
            if (filteredKeys.length === 1) {
                recipient = filteredKeys[0] as string
                amount = outputAmount[recipient] as number
            }
        }
        if (!Boolean(recipient)) throw Error('invalid recipient value')
        if (!Boolean(amount)) throw Error('invalid amount value')
        const invalidTransaction = new Transaction({
            senderWallet,
            recipient,
            amount
        })
        const fakeOutputMap: objectStrKeyIntValue = invalidTransaction.differentPublicKeyOutputMap(999999)
        // Override the outputMap property
        Object.defineProperty(invalidTransaction, 'outputMap', {
            value: fakeOutputMap,
            writable: false
        })
        return invalidTransaction
    }

    private differentPublicKeyOutputMap(publicKeyParam: number): objectStrKeyIntValue {
        const outputMap: objectStrKeyIntValue = this.getOutputMap()
        let publicKeyKey: string = this.getInput().getAddress()
        return {
            ...outputMap,
            [publicKeyKey]: publicKeyParam
        }
    }

    static isValidTransaction(transaction: Transaction): boolean {
        const inputTransaction: InputTransaction = transaction.getInput()
        const outputMap: objectStrKeyIntValue = transaction.getOutputMap()
        const outputTotalValues: number = Object.values(outputMap)
            .reduce((total, outputAmount) => total + outputAmount)

        if (inputTransaction.getAmount() !== outputTotalValues) {
            console.error(`Invalid transaction from ${inputTransaction.getAddress()}`)
            return false
        }

        if (!verifySignature({ publicKey: inputTransaction.getAddress(), data: convertNumberValuesToString(outputMap) as Data, signature: inputTransaction.getSignature() })) {
            console.error(`Invalid signature from ${inputTransaction.getAddress()}`)
            return false
        }
        return true
    }
}

export { Transaction }