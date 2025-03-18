function convertNumberValuesToString<T extends Record<string, number>>(obj: T): Record<string, number | string> {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key,
        typeof value === 'number' ? String(value) : value
      ])
    )
}

export { convertNumberValuesToString }