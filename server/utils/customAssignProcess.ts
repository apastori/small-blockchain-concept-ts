import { IProcessEnv } from "../types/IProcessEnv";
import { objectStrKeyProp } from "../types/objectStrKeyProp";
import { PubNubCredentialKey } from "../types/PubNubCredentialKey";

export function customAssignProcess(target: objectStrKeyProp, source: IProcessEnv): NodeJS.ProcessEnv {
    // Check if target is null or undefined
    if (target === null || target === undefined) {
      throw new Error('Target is null or undefined')
    }
     // Check if sources array is empty
    if (source === null || source === undefined) {
        throw new Error('Source is null or undefined')
    }
    let newTarget: objectStrKeyProp = {...target}
    // Get all enumerable own properties
    Object.keys(source).forEach((key) => {
        // Only consider own properties, not inherited ones
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            const iprocessEnvProp = source[key as keyof IProcessEnv]
            if (iprocessEnvProp !== undefined || iprocessEnvProp !== null) {
                newTarget[key] = typeof iprocessEnvProp === 'object' ? JSON.stringify(iprocessEnvProp) : iprocessEnvProp as string
            }
        }
    })
    // Return the modified target
    return newTarget as NodeJS.ProcessEnv
}