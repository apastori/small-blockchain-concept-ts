import { verifySignature } from "../utils/verifySignature"
import { Wallet } from "./Wallet"

describe('Wallet', () => {
    let wallet: Wallet
    beforeEach(() =>  {
        wallet = new Wallet()
    })
    it('Has a balance', () => {
        expect(wallet).toHaveProperty('balance')   
    })
    it('Has a publicKey', () => {
        expect(wallet).toHaveProperty('publicKey')    
    })
    describe('signing data', () => {
        const data: string = 'foobar'
        it('verifies a signature', () => {
            expect(verifySignature({
                    publicKey: wallet.getPublicKey(),
                    data,
                    signature: wallet.sign(data)
                })
            ).toBe(true)
        })
        it('does not verify a invalid signature', () => {
            expect(verifySignature({
                    publicKey: wallet.getPublicKey(),
                    data,
                    signature: new Wallet().sign(data)
                })
            ).toBe(false)
        })
    })
})