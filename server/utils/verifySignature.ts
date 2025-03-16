import { ec } from "elliptic"
import { Data } from "../types/Data"
import { ellipticCurve } from "../wallet/ellipticCurve"
import { cryptoHash } from "./cryptoHash"

const verifySignature = ({ publicKey, data, signature }: {
    publicKey: string,
    data: Data,
    signature: ec.Signature
}): boolean => {
    const keyFromPublic: ec.KeyPair = ellipticCurve.keyFromPublic(publicKey, 'hex')
    return keyFromPublic.verify(cryptoHash(data), signature)
}

export { verifySignature } 