import { Integer } from "../types/Integer"
import { STARTING_BALANCE } from "./startingBalance"
import { curve, ec } from "elliptic"
import { ellipticCurve } from "./ellipticCurve"
import { cryptoHash } from "../utils/cryptoHash"
import { Data } from "../types/Data"
import { Transaction } from "./Transaction"
import { IWallet } from "../types/IWallet"
import { AmountExceedsBalanceError } from "../errors/AmountExceedBalanceError"

class Wallet implements IWallet {
    private balance: Integer<typeof STARTING_BALANCE>
    private readonly publicKey: string
    private readonly keyPair: ec.KeyPair
    constructor() {
        this.balance = STARTING_BALANCE as Integer<typeof STARTING_BALANCE>
        this.keyPair = ellipticCurve.genKeyPair()
        this.publicKey = this.keyPair.getPublic().encode('hex', false)
    }
    getBalance(): Integer<typeof this.balance> {
        return this.balance
    }
    getPublicKey(): string {
        return this.publicKey
    }
    sign(data: Data): ec.Signature {
        return this.keyPair.sign(cryptoHash(data))
    }
    createTransaction({ recipient, amount }: {
        recipient: string
        amount: number
    }): Transaction {
        if (amount > this.getBalance()) throw new AmountExceedsBalanceError('Amount exceeds balance')
        return new Transaction({ senderWallet: this, recipient, amount })
    }
}

export { Wallet }