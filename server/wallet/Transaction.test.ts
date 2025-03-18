import { InputTransaction } from './InputTransaction'
import { verifySignature } from '../utils/verifySignature'
import { Transaction } from './Transaction'
import { Wallet } from './Wallet'
import { convertNumberValuesToString } from '../utils/convertNumberValuesToString'
import { Data } from '../types/Data'

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
          expect<number | undefined>(transaction.getOutputMap()[recipient]).toEqual(amount)
        });
    
        it('outputs the remaining balance for the `senderWallet`', () => {
          expect<number | undefined>(transaction.getOutputMap()[senderWallet.getPublicKey()])
            .toEqual(senderWallet.getBalance() - amount)
        })
    })
    describe('input', () => {
        it('has en input', () => {
          expect<Transaction>(transaction).toHaveProperty('input')
        })
        it('has a "timestamp" in the input', () => {
          expect<InputTransaction>(transaction.getInput()).toHaveProperty('timestamp')
        })
        it('sets the "amount" to the "SenderWallet" balance', () => {
          expect<number>(transaction.getInput().getAmount()).toEqual(senderWallet.getBalance())
        })
        it('sets the "address" to the "SenderWallet" publicKey', () => {
          expect<string>(transaction.getInput().getAddress()).toEqual(senderWallet.getPublicKey())
        })
        it('signs the input', () => {
          verifySignature({
            publicKey: senderWallet.getPublicKey(),
            data: convertNumberValuesToString(transaction.getOutputMap()) as Data,
            signature: transaction.getInput().getSignature()
          })
        })
    })
})