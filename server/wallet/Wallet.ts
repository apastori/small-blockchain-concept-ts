import { Integer } from "../types/Integer"
import { STARTING_BALANCE } from "./startingBalance"
import { curve, ec } from "elliptic"
import { ellipticCurve } from "./ellipticCurve"
import { cryptoHash } from "../utils/cryptoHash"
import { Data } from "../types/Data"

class Wallet {
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
}

export { Wallet }