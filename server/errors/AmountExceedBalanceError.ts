export class AmountExceedsBalanceError extends Error {
    constructor(message: string) {
      // Pass the message to the parent Error class
      super(message)
      // Set a custom name for the error
      this.name = 'AmountExceedsBalanceError'
      // Set the prototype explicitly for correct inheritance
      Object.setPrototypeOf(this, AmountExceedsBalanceError.prototype)
    }
}