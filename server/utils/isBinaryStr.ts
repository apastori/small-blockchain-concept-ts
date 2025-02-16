function isBinaryString(str: string): boolean {
    // Check if the input is a string
    if (typeof str !== 'string') return false
    // Use a regular expression to check if the string contains only 0s and 1s
    return /^[01]+$/.test(str)
}

export { isBinaryString }