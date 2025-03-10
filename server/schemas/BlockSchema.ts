import { z } from 'zod'
import { dataSchema } from './DataSchema'

export const blockSchema = z.object({
    timestamp: z.number().int().positive(),
    lastHash: z.string().min(1),
    hash: z.string().min(1),
    data: dataSchema,
    nonce: z.number().int().nonnegative(),
    difficulty: z.number().int().nonnegative(),
})