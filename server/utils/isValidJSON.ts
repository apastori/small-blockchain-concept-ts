export function isValidJSON(str: string): boolean {
    try {
      JSON.parse(str); // Attempt to parse the string
      return true // If parsing succeeds, the string is valid JSON
    } catch (error) {
      return false // If parsing fails, the string is not valid JSON
    }
}