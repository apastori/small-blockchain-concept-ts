export function isValidPort(port: string | number): boolean {
    // Check if the port is a number
    if (typeof port === 'number') {
      return port >= 0 && port <= 65535
    }
  
    // Check if the port is a string and can be parsed as a number
    if (typeof port === 'string') {
      const parsedPort = parseInt(port, 10)
      return !isNaN(parsedPort) && parsedPort >= 0 && parsedPort <= 65535
    }
  
    // If it's neither a string nor number, return false
    return false
}