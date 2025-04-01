import { TransactionPool } from './TransactionPool'
import { Transaction } from './Transaction'
import { Wallet } from './Wallet'

describe('TransactionPool', () => {
    let transactionPool: TransactionPool, transaction: Transaction, senderWallet: Wallet

    beforeEach(() => {
      transactionPool = new TransactionPool()
      senderWallet = new Wallet()
      transaction = new Transaction({
        senderWallet,
        recipient: 'fake-recipient',
        amount: 50
      })
    })

    describe('setTransaction() method in TransactionPool class', () => {
        it('adds a transaction', () => {
            transactionPool.setTransaction(transaction)
            expect(transactionPool.getTransactionMap()[transaction.getId()]).toBe(transaction)        
        })    
    })

    describe('existingTransaction() method in TransactionPool class', () => {
      it('returns an existing transaction given the input address', () => {
          transactionPool.setTransaction(transaction)
          expect(transactionPool.existingTransaction({ inputAddress: senderWallet.getPublicKey() })).toBe(transaction)        
      })    
  })
})