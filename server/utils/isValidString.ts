export function isValidString(str: string | null | undefined): boolean {
    return str !== null && str !== undefined && str.trim() !== ''
}