export class ExpressServerStartError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "Error Express Server Start"
        Object.setPrototypeOf(this, ExpressServerStartError.prototype)
        Error.captureStackTrace(this, this.constructor)
    }
}