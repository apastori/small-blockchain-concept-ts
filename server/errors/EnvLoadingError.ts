export class EnvLoadingError extends Error {
    constructor(msg: string) {
      // Pass the message to the parent Error class
      super(msg)
      // Set a custom name for the error
      this.name = 'Error Loading File env.json with the env variables'
      // Set the prototype explicitly for correct inheritance
      Object.setPrototypeOf(this, EnvLoadingError.prototype)
    }
}