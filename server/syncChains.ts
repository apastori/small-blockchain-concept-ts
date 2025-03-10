import axios, { AxiosResponse } from 'axios'
import { Blockchain } from './blockchain/Blockchain'
import { isBlockArray } from './utils/isBlockArray'
import { Block } from './blockchain/Block'

const syncChains = async (url: string, blockchain: Blockchain): Promise<Blockchain> => {
    try {
        const response: AxiosResponse<Blockchain> = await axios.get<Blockchain>(url)

        if (!Array.isArray(response.data)) {
            console.log("Message is not a valid array chain");
            return blockchain
        }

        if (!isBlockArray(response.data)) {
            console.log("One or more elements of the array chain are not valid blocks")
            return blockchain
        }
        const chainMessage: Block[] = response.data as Block[]
        blockchain.replaceChain(chainMessage)
        return blockchain
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error("Error Getting Blockchain from Root")
        }
        console.error("unknow error", error)
        return blockchain
    }
}

export { syncChains }