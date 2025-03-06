export class EnvInvalidProcessEnvError extends Error {
    constructor() {
      // Pass the message to the parent Error class
      super('Env JSON from env.json is not a valid ProcessEnv object')
      // Set a custom name for the error
      this.name = 'EnvInvalidProcessEnv'
      // Set the prototype explicitly for correct inheritance
      Object.setPrototypeOf(this, EnvInvalidProcessEnvError.prototype)
    }
}