import { InputTransaction } from './InputTransaction'
import { verifySignature } from '../utils/verifySignature'
import { Transaction } from './Transaction'
import { Wallet } from './Wallet'
import { convertNumberValuesToString } from '../utils/convertNumberValuesToString'
import { Data } from '../types/Data'
import { objectStrKeyIntValue } from '../types/objectStrKeyIntValue'
import { ec } from 'elliptic'

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
    describe('validTransaction static function', () => {
        let errorMock: jest.Mock
        beforeEach(() => {
            errorMock = jest.fn()
            global.console.error = errorMock
        })
        describe('when the transaction is valid', () => {
            it('returns true', () => {
                expect<boolean>(Transaction.isValidTransaction(transaction)).toBe(true)
            })  
        })
        describe('when the transaction is not valid, invalid', () => {
            describe('because the OutputMap is invalid', () => {
                it('returns false and logs error', () => {
                  expect<boolean>(Transaction.isValidTransaction(
                      Transaction.fakeTransactionInvalidPublicKey(
                          transaction,
                          senderWallet
                      )
                  )).toBe(false)
                  expect(errorMock).toHaveBeenCalled()  
                })
            })
            describe('because the transaction input signature is invalid', () => {
                it('returns false and logs error', () => {
                  expect<boolean>(Transaction.isValidTransaction(
                    Transaction.fakeTransactionInvalidSignature(
                        transaction,
                        senderWallet
                    )
                  )).toBe(false)
                  expect(errorMock).toHaveBeenCalled()    
                })
            })  
        })  
    })
    describe('update() function to update Transaction', () => {
      let originalSignature: ec.Signature, originalSenderOutput: number
      let nextRecipient: string, nextAmount: number
      describe('and the amount is invalid', () => {
        it('throws an error', () => {
          expect(() => {
            transaction.update({
              senderWallet, recipient: 'foo', amount: 999999
            })
          }).toThrow('Amount exceeds balance')
        })
      })
  
      describe('and the amount is valid', () => {
        beforeEach(() => {
          originalSignature = transaction.getInput().getSignature();
          originalSenderOutput = transaction.getOutputMap()[senderWallet.getPublicKey()] as number
          nextRecipient = 'next-recipient'
          nextAmount = 50
          transaction.update({
            senderWallet, recipient: nextRecipient, amount: nextAmount
          })
        })
        it('outputs the amount to the next recipient', () => {
          expect<number>(transaction.getOutputMap()[nextRecipient] as number).toEqual(nextAmount)
        })  
        it('subtracts the amount from the original sender output amount', () => {
          expect<number>(transaction.getOutputMap()[senderWallet.getPublicKey()] as number)
            .toEqual(originalSenderOutput - nextAmount)
        })
        it('maintains a total output that matches the input amount', () => {
          expect<number>(
            Object.values(transaction.getOutputMap())
              .reduce((total, outputAmount) => total + outputAmount)
          ).toEqual(transaction.getInput().getAmount())
        })
        it('re-signs the transaction', () => {
          expect<ec.Signature>(transaction.getInput().getSignature()).not.toEqual(originalSignature)
        })    
      })
    })
})