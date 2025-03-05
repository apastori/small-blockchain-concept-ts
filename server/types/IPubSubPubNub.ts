import PubNub, { Listener, Subscription, Publish } from "pubnub"

// Define an interface for PubNub service
export interface IPubSubPubNub {
  getPubNub(): PubNub // Using the get PubNub type
  getId(): string // Using the get Id Type
  getListener(messageObject: Subscription.Message): Listener
  publishMessage(pubParams: Publish.PublishParameters): void
}