import { z } from 'zod'
import { objectStrKeyPropSchema } from './objectStrKeyPropSchema'

export const dataSchema = z.union([
    objectStrKeyPropSchema,
    z.string()
])