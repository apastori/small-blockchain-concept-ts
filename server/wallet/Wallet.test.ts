import { verifySignature } from "../utils/verifySignature"
import { Wallet } from "./Wallet"

describe('Wallet', () => {
    let wallet: Wallet
    beforeEach(() =>  {
        wallet = new Wallet()
    })
    it('Has a balance', () => {
        expect<Wallet>(wallet).toHaveProperty('balance')   
    })
    it('Has a publicKey', () => {
        expect<Wallet>(wallet).toHaveProperty('publicKey')    
    })
    describe('signing data', () => {
        const data: string = 'foobar'
        it('verifies a signature', () => {
            expect<boolean>(verifySignature({
                    publicKey: wallet.getPublicKey(),
                    data,
                    signature: wallet.sign(data)
                })
            ).toBe(true)
        })
        it('does not verify a invalid signature', () => {
            expect<boolean>(verifySignature({
                    publicKey: wallet.getPublicKey(),
                    data,
                    signature: new Wallet().sign(data)
                })
            ).toBe(false)
        })
    })
})