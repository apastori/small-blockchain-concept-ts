export class NoConfigPubNubError extends Error {
    constructor() {
      // Pass the message to the parent Error class
      super("No Config PubNub")
      // Set a custom name for the error
      this.name = 'NoConfigPubNubError'
      // Set the prototype explicitly for correct inheritance
      Object.setPrototypeOf(this, NoConfigPubNubError.prototype)
    }
}