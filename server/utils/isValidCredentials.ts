import { PubNubCredentials } from "../types/PubNubCredentials";

export function isValidCredentials(obj: any): obj is PubNubCredentials {
    return (
      typeof obj === "object" &&
      obj !== null &&
      typeof obj.PUBLISH_KEY === "string" &&
      typeof obj.SUBSCRIBE_KEY === "string" &&
      typeof obj.SECRET_KEY === "string"
    )
}