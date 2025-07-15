import { z } from 'zod'
import { SignatureSchema } from './SignatureSchema'

const InputTransactionSchema = z.object({
    timestamp: z.number().int().positive(),
    amount: z.number().nonnegative(),
    address: z.string(),
    signature: SignatureSchema
})

export { InputTransactionSchema }