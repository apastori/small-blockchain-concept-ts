import { z } from 'zod'

const PortSchema: z.ZodEffects<z.ZodUnion<[z.ZodString, z.ZodNumber]>, string | number, string | number> = 
    z.string().or(z.number()).refine(
    (portval: string | number) => {
      const port: number = typeof portval === 'string' ? parseInt(portval, 10) : portval
      return !isNaN(port) && port >= 0 && port <= 65535
    },
    { message: 'Invalid port string or number, must be a string or number between 0 and 65535.' }
)

export { PortSchema }