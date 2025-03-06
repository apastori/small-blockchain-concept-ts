export class EnvInvalidJSONError extends Error {
    constructor() {
      // Pass the message to the parent Error class
      super('Env String from env.json is invalid JSON')
      // Set a custom name for the error
      this.name = 'EnvInvalidJSON'
      // Set the prototype explicitly for correct inheritance
      Object.setPrototypeOf(this, EnvInvalidJSONError.prototype)
    }
}