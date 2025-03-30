import { PositiveIntegerSchema } from "../schemas/PositiveIntegerSchema"
import { objectStrKeyIntValue } from "../types/objectStrKeyIntValue"
import { TransactionParams } from "../types/TransactionParams"
import { v4 as uuidv4 } from 'uuid'
import { Wallet } from "./Wallet"
import { InputTransaction } from "./InputTransaction"
import { verifySignature } from "../utils/verifySignature"
import { convertNumberValuesToString } from "../utils/convertNumberValuesToString"
import { Data } from "../types/Data"
import { AmountExceedsBalanceError } from "../errors/AmountExceedBalanceError"
import { ITransaction } from "../types/ITransaction"

class Transaction implements ITransaction {
    private readonly id: string
    private outputMap: objectStrKeyIntValue
    private input: InputTransaction
    constructor({ senderWallet, recipient, amount}: TransactionParams) {
        this.id = uuidv4()
        this.outputMap = this.createOutputMap({ senderWallet, recipient, amount})
        this.input = this.createInput({ senderWallet, outputMap: this.getOutputMap() })
    }
    public getId(): string {
        return this.id
    }

    public getOutputMap(): objectStrKeyIntValue {
        return this.outputMap
    }

    public getInput(): InputTransaction {
        return this.input
    }

    public getOutputMapString(): string {
        return JSON.stringify(this.getOutputMap())
    }

    private setOutputMap(outputs: objectStrKeyIntValue): void {
        const currentOutputMap: objectStrKeyIntValue = this.getOutputMap()
        this.outputMap = {
            ...currentOutputMap, 
            ...outputs 
        }
    }

    private setInput(newInput: InputTransaction): void {
        this.input = newInput
    }

    private createOutputMap({ senderWallet, recipient, amount}: TransactionParams): objectStrKeyIntValue {
        const outputMap: objectStrKeyIntValue = {}
        if (PositiveIntegerSchema.parse(amount) && PositiveIntegerSchema.parse(senderWallet.getBalance())) {
            outputMap[recipient] = amount
            outputMap[senderWallet.getPublicKey()] = senderWallet.getBalance() - amount
        }
        return outputMap
    }
    
    private createInput({ senderWallet, outputMap}: { 
        senderWallet: Wallet 
        outputMap: objectStrKeyIntValue
    }): InputTransaction {
        return new InputTransaction({
            senderWallet,
            outputMap
        })
    }

    static fakeTransactionInvalidPublicKey(transaction: Transaction, senderWallet: Wallet): Transaction {
        const outputMap: objectStrKeyIntValue = transaction.getOutputMap()
        const publicKeyKey: string = transaction.getInput().getAddress()
        const outputMapKeys: string[] = Object.keys(outputMap)
        let recipient: string = ''
        let amount: number = 0
        if (outputMapKeys.length === 2) {
            const filteredKeys: string[] = outputMapKeys.filter(key => key !== publicKeyKey)
            if (filteredKeys.length === 1) {
                recipient = filteredKeys[0] as string
                amount = outputMap[recipient] as number
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

    static fakeTransactionInvalidSignature(transaction: Transaction, senderWallet: Wallet): Transaction {
        const outputMap: objectStrKeyIntValue = transaction.getOutputMap()
        const publicKeyKey: string = transaction.getInput().getAddress()
        const outputMapKeys: string[] = Object.keys(outputMap)
        let recipient: string = ''
        let amount: number = 0
        if (outputMapKeys.length === 2) {
            const filteredKeys: string[] = outputMapKeys.filter(key => key !== publicKeyKey)
            if (filteredKeys.length === 1) {
                recipient = filteredKeys[0] as string
                amount = outputMap[recipient] as number
            }
        }
        if (!Boolean(recipient)) throw Error('invalid recipient value')
        if (!Boolean(amount)) throw Error('invalid amount value')
        const invalidTransaction = new Transaction({
            senderWallet,
            recipient,
            amount
        })
        const newInputTransaction: InputTransaction = new InputTransaction({
            senderWallet,
            outputMap
        })
        Object.defineProperty(newInputTransaction, 'signature', {
            value: new Wallet().sign('data'),
            writable: false
        })
        Object.defineProperty(invalidTransaction, 'input', {
            value: newInputTransaction,
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

    public update({ senderWallet, recipient, amount}: {
        senderWallet: Wallet
        recipient: string
        amount: number
    }) {
        if (amount > (this.getOutputMap()[senderWallet.getPublicKey()] as number)) throw new AmountExceedsBalanceError('Amount exceeds balance')
        if (!this.getOutputMap()[recipient]) {
            this.setOutputMap({[recipient]: amount})
        } else {
            this.setOutputMap({[recipient]: (this.getOutputMap()[recipient] as number) + amount})
        }
        const publicKey: string = senderWallet.getPublicKey()
        this.setOutputMap({ [publicKey]: (this.getOutputMap()[senderWallet.getPublicKey()] as number) - amount })
        this.setInput(this.createInput({ senderWallet, outputMap: this.getOutputMap() }))
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