import { StringBooleanType } from "../types/StringBooleanType"

function isValidStringBoolean(value: any): value is StringBooleanType {
    return typeof value === 'string' && (value === 'true' || value === 'false')
}

export { isValidStringBoolean }