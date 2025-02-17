import express, { Application, Request, Response } from "express"
import { Blockchain } from "./Blockchain"

const app: Application = express()
const blockchain: Blockchain = new Blockchain()

app.get('/api/blocks', (req: Request, res: Response) => {
    res.json(blockchain.getChain())
})

const PORT: Number = 3000

app.listen(PORT, () => {
    console.log(`listening at localhost:${String(PORT)}`)
})