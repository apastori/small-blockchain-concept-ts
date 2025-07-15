import { z } from 'zod'
import { PositiveIntegerSchema } from './PositiveIntegerSchema'

export const objectStrKeyIntValueSchema = z.record(z.string(), PositiveIntegerSchema)