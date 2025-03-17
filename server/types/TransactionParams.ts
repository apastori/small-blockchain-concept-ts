import { Wallet } from "../wallet/Wallet"

export interface TransactionParams {
    senderWallet: Wallet
    recipient: string
    amount: number
}