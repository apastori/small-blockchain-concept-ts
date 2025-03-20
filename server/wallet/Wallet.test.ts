import { verifySignature } from "../utils/verifySignature"
import { Transaction } from "./Transaction"
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
    describe('createTransaction() class method', ()  => {
        describe('and the amount exceeds the balance', () => {
            it('throws an error', () => {
                expect(() => wallet.createTransaction({ 
                    amount: 999999, 
                    recipient: 'foo-recipient' 
                })).toThrow('Amount exceeds balance')
            })
        })
        describe('and the amount is Valid', () => {
            let transaction: Transaction, amount: number, recipient: string
            beforeEach(() => {
                amount = 50
                recipient = 'foo-recipient'
                transaction = wallet.createTransaction({ amount, recipient })
            })
            it('creates an instance of `Transaction` class', () => {
                expect<boolean>(transaction instanceof Transaction).toBe(true)
            })
            it('matches the transaction input with the wallet public key', () => {
                expect<string>(transaction.getInput().getAddress()).toEqual(wallet.getPublicKey())
            })
            it('outputs the amount the recipient', () => {
                expect<number>(transaction.getOutputMap()[recipient] as number).toEqual(amount)
            })     
        })     
    })
})