import { z } from 'zod'

export const objectStrKeyPropSchema = z.record(z.string(), z.string())