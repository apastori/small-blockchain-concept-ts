import type { Environment } from "../types/Environment";

export function isValidEnvironment(str: string): str is Environment {
    return (str === "development" || str === "production" || str === "testing")
}