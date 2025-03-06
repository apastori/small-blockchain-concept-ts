import { Request, Response, NextFunction } from 'express'

interface IMiddleware {
    (req?: Request, res?: Response, next?: NextFunction): void
}

export { IMiddleware }