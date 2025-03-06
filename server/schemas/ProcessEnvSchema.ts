import { z } from 'zod'
import { PortSchema } from './PortSchema'
import { EnvironmentSchema } from './EnvironmentSchema'
import { PubNubConfigSchema } from './PubNubConfigSchema'
import { PubSubTypeSchema } from './PubSubTypeSchema'

const ProcessEnvSchema = z.object({
    PORT: PortSchema,
    ENV: EnvironmentSchema,
    HOST: z.string(),
    PUBSUB_TYPE: PubSubTypeSchema,
    PUBNUB_CONFIG: PubNubConfigSchema.optional()
}).refine((data: {
    PORT: string | number
    ENV: "development" | "testing" | "production"
    HOST: string
    PUBSUB_TYPE: "cloud" | "local"
    PUBNUB_CONFIG?: {
        PUBLISH_KEY: string;
        SUBSCRIBE_KEY: string;
        SECRET_KEY: string;
    } | undefined;
}) => {
    // If PUBNUB_TYPE is 'cloud', PUBSUB_CONFIG must be present
    if (data['PUBSUB_TYPE'] === 'cloud') {
        return data['PUBNUB_CONFIG'] !== undefined 
    }
    return true
}, {
    message: "PUBNUB_CONFIG is required when PUBSUB_TYPE is 'cloud'"
})

export { ProcessEnvSchema }