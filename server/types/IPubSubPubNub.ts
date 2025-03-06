import PubNub, { Listener, Subscription, Publish } from "pubnub"
import { Blockchain } from "../blockchain/Blockchain"

// Define an interface for PubNub service
export interface IPubSubPubNub {
  getPubNub(): PubNub // Using the get PubNub type
  getId(): string // Using the get Id Type
  getBlockchain(): Blockchain
  handleMessage(channel: string, message: string): void
  getListener(messageObject: Subscription.Message): Listener
  publishMessage(pubParams: Publish.PublishParameters): void
  broadcastChain(): void
}