import { z } from 'zod'

const PubNubConfigSchema = z.object({
    PUBLISH_KEY: z.string().min(1),
    SUBSCRIBE_KEY: z.string().min(1),
    SECRET_KEY: z.string().min(1)
}).strict()

export { PubNubConfigSchema }