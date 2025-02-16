import { sha3_256 } from 'js-sha3'
import { Data } from './types/Data'
import { hexToBinaryLookup } from './hexToBinaryLookup'

export const cryptoHashBinary = (...inputs: Data[]): string => {
    let data: string = ''
    const inputsSorted: Data[] = inputs.sort((a, b) => {
        const valA: string = typeof a === "string" ? a : JSON.stringify(a)
        const valB: string = typeof b === "string" ? b : JSON.stringify(b)
        return valA.localeCompare(valB, "en", { sensitivity: "variant" })
    })
    for (let i = 0; i < inputs.length; i++) {
        const input = inputsSorted[i]
        let inputData = typeof input === "string" ? input : JSON.stringify(input)
        if (i !== inputs.length - 1) inputData = inputData + ' '
        data += inputData
    }
    const hashSHA3: string = hexToBinaryLookup(sha3_256(data))
    return hashSHA3
}