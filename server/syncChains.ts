import axios, { AxiosResponse } from 'axios'
import { Blockchain } from './blockchain/Blockchain'
import { isBlockArray } from './utils/isBlockArray'
import { Block } from './blockchain/Block'
import { PlainBlock } from './types/plainBlock'
import { isValidObject } from './utils/isValidObject'
import { isString } from './utils/isString'
import { Data } from './types/Data'

const syncChains = (blockchain: Blockchain): ((url: string) => Promise<void>) => {
    return (url: string): Promise<void> => {
        return axios.get<Blockchain>(url)
            .then((response: AxiosResponse<Blockchain, any>) => {
                console.log("Sync Chain Status Code", response.status)
                if (!Array.isArray(response.data)) {
                    throw new Error("data is not a valid array chain")
                }
                if (!isBlockArray(response.data)) {
                    throw new Error("One or more elements of the array chain are not valid blocks")
                }
                const plainChainMessage: PlainBlock[] = response.data as PlainBlock[]
                const chainMessage: Block[] = plainChainMessage.map((plainBlock: PlainBlock) => {
                    if (!isValidObject(plainBlock.data) && !isString(plainBlock.data)) {
                        throw new Error("data is not valid type string or key value pairs")
                    }
                    return new Block({
                        timestamp: new Date(plainBlock.timestamp),
                        lastHash: plainBlock.lastHash,
                        hash: plainBlock.hash,
                        data: plainBlock.data as Data,
                        nonce: plainBlock.nonce,
                        difficulty: plainBlock.difficulty
                    })
                })
                console.log("replace chain with: ", chainMessage)
                blockchain.replaceChain(chainMessage)
            })
            .catch((error: unknown) => {
                if (error instanceof Error) {
                    throw new Error("Error Getting Blockchain from Root")
                }
                console.error("unknown error", error)
            })
    }
}

export { syncChains }