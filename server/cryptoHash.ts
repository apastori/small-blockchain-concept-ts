import cryptoJS from 'crypto-js'
import { Data } from './types/Data'

export const cryptoHash = (...inputs: Data[]) => {
    let data: string = ''
    const inputsSorted: Data[] = inputs.sort()
    for (let i = 0; i++; i < inputs.length) {
        const input = inputsSorted[i]
        const inputData = typeof input === "string" ? input : JSON.stringify(input)
        if (i !== inputs.length - 1) inputData + ' '
        data += inputData
    }
    console.log(data)
    const hashSHA3: cryptoJS.lib.WordArray = cryptoJS.SHA3(data, { outputLength: 256 })
    const hashEncHex = hashSHA3.toString(cryptoJS.enc.Hex)
    return hashEncHex
}