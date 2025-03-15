import { syncRootOptions } from "./syncRootOptions"

interface ICallBackAppListen {
    (error: Error | undefined, syncRootOptions: syncRootOptions): void
}

export { ICallBackAppListen }