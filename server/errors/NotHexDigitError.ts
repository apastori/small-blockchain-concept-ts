export class NoHexDigitError extends Error {
    value: string
    constructor(message: string, value: string) {
      // Pass the message to the parent Error class
      super(message)
      // Set a custom name for the error
      this.name = 'NoHexDigitError'
      this.value = value
      // Set the prototype explicitly for correct inheritance
      Object.setPrototypeOf(this, NoHexDigitError.prototype)
    }
}