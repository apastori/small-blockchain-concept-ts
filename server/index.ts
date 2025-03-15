import { copyEnv } from "./copyEnv"
copyEnv()
import express, { Application, Request, Response } from "express"
import { Blockchain } from "./blockchain/Blockchain"
import { Data } from "./types/Data"
import bodyParser from "body-parser"
import { PubSubPubNub } from "./PubSub/PubSubPubNub"
import { ProcessEnvFinal } from "./loadEnv"
import { PubSubRedis } from "./PubSub/PubSubRedis"
import { PubSubConfig } from "./PubSub/PubSubConfig"
import { startExpressServer } from "./startServerExpress"
import { customAssignProcess } from "./utils/customAssignProcess"
import { objectStrKeyProp } from "./types/objectStrKeyProp"
import { syncChains } from "./syncChains"

//Setting up environment
// Call the customAssignProcess function
const updatedEnv: NodeJS.ProcessEnv = customAssignProcess(process.env as objectStrKeyProp, ProcessEnvFinal)

// Update process.env with the returned object
process.env = updatedEnv

//Setting up the Port
export const DEFAULT_PORT: string | '5000' = process.env.PORT || '5000'

//Root Node Address
const ROOT_NODE_ADDRESS: string = `http://${process.env.HOST}:${DEFAULT_PORT}`

//Setting up Blockchain
let blockchain = new Blockchain()

//Setting Up PuhSub
let pubsub: PubSubRedis | PubSubPubNub = PubSubConfig(blockchain)

//Setting the Express App
const app: Application = express()

//Testing Broadcasting Chain
//setTimeout(() => pubsub.broadcastChain(), 1000)

// Parse JSON request bodie
app.use(bodyParser.json())

// Parse URL-encoded request bodies
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/api/blocks', (_req: Request, res: Response): void => {
    res.json(blockchain.getChain())
})

app.get('/api/blocks/length', (_req: Request, res: Response) => {
    res.json(blockchain.getChainLength())
})

app.post('/api/mine', (req: Request, res: Response) => {
    const { data }: { data: Data } = req.body
    blockchain.addBlock({ data })
    pubsub.broadcastChain()
    res.json(blockchain.getChain())
})

let PEER_PORT: number = 0

if (process.env['GENERATE_PEER_PORT'] === 'true') {
    PEER_PORT = Number(DEFAULT_PORT) + Math.ceil(Math.random() * 1000)
    process.env.PORT = String(PEER_PORT)
}

let syncWithRoot: ((url: string) => Promise<Blockchain | void>) | null = null

export const PORT: string = Boolean(PEER_PORT) ? String(PEER_PORT) : DEFAULT_PORT

if (Boolean(PEER_PORT)) {
    syncWithRoot = syncChains(blockchain) 
}

startExpressServer({ app, PORT: DEFAULT_PORT, PEER_PORT, syncWithRoot })

console.log("index ends")