import { z } from 'zod'
import * as ec from 'elliptic'

const SignatureSchema = z.object({
    r: z.string(), // r component of signature is typically a string
    s: z.string(), // s component of signature is typically a string
    recoveryParam: z.number().nullable(), // Some EC libraries include this
}).passthrough()

export { SignatureSchema }