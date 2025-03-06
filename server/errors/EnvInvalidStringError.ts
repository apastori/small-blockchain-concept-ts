export class EnvInvalidStringError extends Error {
    constructor() {
      // Pass the message to the parent Error class
      super('Env String from env.json is empty')
      // Set a custom name for the error
      this.name = 'EnvInvalidString'
      // Set the prototype explicitly for correct inheritance
      Object.setPrototypeOf(this, EnvInvalidStringError.prototype)
    }
}