import { sha3_256 } from 'js-sha3'
import { Data } from './types/Data'

export const cryptoHash = (...inputs: Data[]): string => {
    let data: string = ''
    const inputsSorted: Data[] = inputs.sort()
    for (let i = 0; i < inputs.length; i++) {
        const input = inputsSorted[i]
        let inputData = typeof input === "string" ? input : JSON.stringify(input)
        if (i !== inputs.length - 1) inputData = inputData + ' '
        data += inputData
    }
    console.log(data)
    const hashSHA3: string = sha3_256(data)
    return hashSHA3
}