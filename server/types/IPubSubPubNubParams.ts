import { PubNubConfiguration } from "pubnub"
import { Blockchain } from "../blockchain/Blockchain"

export interface IPubSubPubNubParams {
    blockchain: Blockchain,
    credentials?: PubNubConfiguration
}