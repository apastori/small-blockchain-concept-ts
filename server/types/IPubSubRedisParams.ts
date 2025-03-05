import { Blockchain } from "../blockchain/Blockchain"
import { objectStrKeyProp } from "./objectStrKeyProp"

export interface IPubSubRedisParams {
    blockchain: Blockchain,
    channels: objectStrKeyProp
}