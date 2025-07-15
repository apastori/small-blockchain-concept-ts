import { z } from 'zod'
import { InputTransactionSchema } from './InputTransactionSchema'
import { objectStrKeyIntValueSchema } from './objectStrKeyIntValueSchema'

const TransactionSchema = z.object({
    id: z.string(),
    outputMap: objectStrKeyIntValueSchema,
    input: InputTransactionSchema
})

export { TransactionSchema }