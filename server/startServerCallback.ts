import { Request, Response, NextFunction } from 'express'
import { IMiddlewareError } from './types/IMiddlewareError'
import { ExpressServerStartError } from './errors/ExpressServerStartError';

const startServerCallback: IMiddlewareError = function(error?: Error): void {
    if (error) {
        throw new ExpressServerStartError(error.message)
    }
    console.log(`Express with Typescript! http://localhost:${Number(process.env['PORT']) || 5000}`)
    if (process.env['ENV'] === 'development') console.log(process.env)
}

export { startServerCallback }