export interface IMiddlewareError {
    (error?: Error): void
}