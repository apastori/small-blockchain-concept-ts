import fs from 'fs'
import path from 'path'
import { NoEnvFileFoundError } from './errors/NoEnvFileFoundError'
import { NoBuildFolderError } from './errors/NotBuildFolderError'
import { EnvFileNotCopiedError } from './errors/EnvFileNotCopiedError'

const copyEnv = () => {
    const source: string = path.join(process.cwd(), "env.json")
    const destinationDir = path.join(process.cwd(), './build')
    const destination: string = path.join(destinationDir, "env.json")
    try {
        if (!fs.existsSync(source)) {
          throw new NoEnvFileFoundError(`Source Env file not found: ${source}`);
        }
        if (!fs.existsSync(destinationDir)) {
          throw new NoBuildFolderError(`Directory file not found: ${source}`)
        }
        fs.copyFileSync(source, destination)
        console.log("✅ env.json copied successfully!")
      } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("❌ Error copying env.json:", error.message)
            throw new EnvFileNotCopiedError(`Source file not found: ${source} or `+`Destination file route: ${destination}`)
        } else {
            console.error("❌ An unknown error occurred:", error);
        }
        process.exit(1) // Exit with an error code
    }
}

export { copyEnv }