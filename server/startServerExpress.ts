
import { ExpressServerStartError } from './errors/ExpressServerStartError'
import { startExpressServerParams } from './types/startExpressServerParams'

const startExpressServer = ({ app, PORT, PEER_PORT, syncWithRoot }: startExpressServerParams) => {
    const isPeerPort: boolean = Boolean(PEER_PORT)
    app.listen(isPeerPort ? PEER_PORT : Number(PORT), (error?: Error) => {
        if (error) {
            throw new ExpressServerStartError(error.message)
        }
        console.log(`Express with Typescript! http://localhost:${Number(process.env['PORT']) || 5000}`)
        if (process.env['ENV'] === 'development') console.log(process.env)
        if (isPeerPort && syncWithRoot) {
            syncWithRoot(`http://${process.env.HOST}:${PORT}/api/blocks`)
                .then(() => console.log('Blockchain synced successfully'))
                .catch(err => console.error('Failed to sync blockchain:', err));
        }
    }).on('error', (error) => {
        throw new ExpressServerStartError(error.message)
    })
}

export { startExpressServer }