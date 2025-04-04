import { ec } from "elliptic";
import { IInputTransaction } from "../types/IInputTransaction"
import { Wallet } from "./Wallet"
import { objectStrKeyIntValue } from "../types/objectStrKeyIntValue"
import { convertNumberValuesToString } from "../utils/convertNumberValuesToString"
import { Data } from "../types/Data"

class InputTransaction implements IInputTransaction {
    private readonly timestamp: number
    private readonly amount: number
    private readonly address: string
    private readonly signature: ec.Signature
    constructor({ senderWallet, outputMap}: { 
        senderWallet: Wallet 
        outputMap: objectStrKeyIntValue
    }) {
        this.timestamp = Date.now(),
        this.amount = senderWallet.getBalance(),
        this.address = senderWallet.getPublicKey(),
        this.signature = senderWallet.sign(convertNumberValuesToString(outputMap) as Data)
    }
    public getTimestamp(): number {
        return this.timestamp
    }
    public getAmount(): number {
        return this.amount
    }
    public getAddress(): string {
        return this.address
    }
    public getSignature(): ec.Signature {
        return this.signature
    } 
}

export { InputTransaction }