export function isBlock(arr: any[]): boolean {
    return arr.every((item: any) => {
      return typeof item === 'object' && 
      item !== null && 
      'timestamp' in item && 
      'lastHash' in item &&
      'hash' in item &&
      'data' in item &&
      'nonce' in item &&
      'difficulty' in item
    })
}
  