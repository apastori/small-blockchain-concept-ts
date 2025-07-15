import { PubNubConfiguration } from "pubnub"
import { Blockchain } from "../blockchain/Blockchain"
import { TransactionPool } from "../wallet/TransactionPool"

export interface IPubSubPubNubParams {
    blockchain: Blockchain
    credentials: PubNubConfiguration
    transactionPool: TransactionPool
}