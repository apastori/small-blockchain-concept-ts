import { IProcessEnv } from "../types/IProcessEnv"
import { isString } from "./isString"
import { isValidCredentials } from "./isValidCredentials"
import { isValidEnvironment } from "./isValidEnvironment"
import { isValidObject } from "./isValidObject"
import { isValidPort } from "./isValidPort"
import { isValidStringBoolean } from "./isValidStringBoolean"

export function isValidProcessEnv(obj: any): obj is IProcessEnv {
    return (
      isValidObject(obj) && isValidPort(obj['PORT']) &&
      (isString(obj['ENV']) && isValidEnvironment(obj['ENV'])) &&
      (typeof obj['HOST'] === "string") &&
      (
        (
            obj["PUBSUB_TYPE"] === "cloud" &&
            isValidCredentials(obj["PUBNUB_CONFIG"])
        ) || 
        obj["PUBSUB_TYPE"] === "local"
      ) &&
      (
        obj["GENERATE_PEER_PORT"] === undefined ||
        isValidStringBoolean(obj["GENERATE_PEER_PORT"])
      )
    )
}