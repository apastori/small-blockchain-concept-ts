import { z } from 'zod'

const PubSubTypeSchema: z.ZodEnum<["cloud", "local"]> = z.enum(['cloud', 'local'])

export { PubSubTypeSchema }