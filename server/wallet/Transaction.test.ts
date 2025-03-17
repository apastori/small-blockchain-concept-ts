import { Transaction } from './Transaction'
import { Wallet } from './Wallet'

describe('Transaction', () => {
    let transaction: Transaction
    let senderWallet: Wallet
    let recipient: string
    let amount: number
    beforeEach(() => {
        senderWallet = new Wallet()
        recipient = 'recipient-public-key'
        amount = 50
        transaction = new Transaction({ senderWallet, recipient, amount })
    })
    it('has an id', () => {
        expect<Transaction>(transaction).toHaveProperty('id')
    })
    describe('outputMap', () => {
        it('has an `outputMap`', () => {
          expect<Transaction>(transaction).toHaveProperty('outputMap')
        });
    
        it('outputs the amount to the recipient', () => {
          expect(transaction.getOutputMap()[recipient]).toEqual(amount)
        });
    
        it('outputs the remaining balance for the `senderWallet`', () => {
          expect(transaction.getOutputMap()[senderWallet.getPublicKey()])
            .toEqual(senderWallet.getBalance() - amount)
        })
    })
})