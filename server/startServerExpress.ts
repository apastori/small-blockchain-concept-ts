import type { Application } from 'express'
import { startServerCallback } from './startServerCallback'
import { ExpressServerStartError } from './errors/ExpressServerStartError'

const startExpressServer = (app: Application, port: string) => {
    app.listen(Number(port), startServerCallback).on('error', (error) => {
        throw new ExpressServerStartError(error.message)
    })
}

export { startExpressServer }