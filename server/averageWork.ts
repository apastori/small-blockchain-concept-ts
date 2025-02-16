import { Block } from "./Block"
import { Blockchain } from "./Blockchain"

const averageWork = (): void => {
    const blockchain: Blockchain = new Blockchain()
    blockchain.addBlock({ data: 'initial' })
    let prevTimestamp: Date
    let nextTimestamp: Date
    let nextBlock: Block
    let timeDiff: number
    let average: number
    const times: number[] = []

    for (let i: number = 0; i < 10000; i++) {
        prevTimestamp = blockchain.getLastBlock().getTimestamp()
        blockchain.addBlock({ data:  `block ${i}`})
        nextBlock = blockchain.getLastBlock()
        nextTimestamp = nextBlock.getTimestamp()
        timeDiff = nextTimestamp.getTime() - prevTimestamp.getTime()
        times.push(timeDiff)
        average = times.reduce((total: number, num: number) => {
            return total + num
        }) / times.length
        console.log(nextBlock)
        console.log(`Time to mine block: ${timeDiff}ms. Difficulty: ${nextBlock.getDifficulty()}. Average time: ${average}ms`)
    }
}

export { averageWork }