import { z } from "zod"

export const GeneratePeerPortSchema: z.ZodEnum<['true', 'false']> = z.enum(['true', 'false'])