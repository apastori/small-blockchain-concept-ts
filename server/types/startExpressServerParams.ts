import { Application } from "express"
import { Blockchain } from "../blockchain/Blockchain"

export interface startExpressServerParams {
    app: Application
    PORT: string
    PEER_PORT: number
    syncWithRoot: ((url: string) => Promise<void | Blockchain>) | null
}