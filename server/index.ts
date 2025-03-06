import express, { Application, Request, Response } from "express"
import { Blockchain } from "./blockchain/Blockchain"
import { Data } from "./types/Data"
import bodyParser from "body-parser"
import { PubSubPubNub } from "./PubSub/PubSubPubNub"
import { Block } from "./blockchain/Block"

//Setting up Blockchain
const blockchain = new Blockchain()
const pubsub: PubSubPubNub = new PubSubPubNub({ blockchain })

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

const PORT: Number = 3000

app.listen(PORT, () => {
    console.log(`listening at localhost: ${String(PORT)}`)
})