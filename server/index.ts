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

//Setting up environment
// Call the customAssignProcess function
const updatedEnv = customAssignProcess(process.env as objectStrKeyProp, ProcessEnvFinal)

// Update process.env with the returned object
process.env = updatedEnv

//Setting up the Port
const PORT: string | '5000' = process.env.PORT || '5000'

//Setting up Blockchain
const blockchain = new Blockchain()

//Setting Up PuhSub
let pubsub: PubSubRedis | PubSubPubNub = PubSubConfig(blockchain)

//Setting the Express App
const app: Application = express()

//Testing Broadcasting Chain
setTimeout(() => pubsub.broadcastChain(), 1000)

// Parse JSON request bodie
app.use(bodyParser.json())

// Parse URL-encoded request bodies
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/api/blocks', (_req: Request, res: Response): void => {
    res.json(blockchain.getChain())
})

app.post('/api/mine', (req: Request, res: Response) => {
    const { data }: { data: Data } = req.body
    blockchain.addBlock({ data })
    res.send('Success creating Block')
})

startExpressServer(app, PORT)