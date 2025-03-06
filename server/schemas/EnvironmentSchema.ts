import { z } from 'zod'

const EnvironmentSchema: z.ZodEnum<["development", "testing", "production"]> = z.enum(['development', 'testing', 'production'])

export { EnvironmentSchema }