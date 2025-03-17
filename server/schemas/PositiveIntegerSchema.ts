import { z } from "zod"

const PositiveIntegerSchema = z.number()
  .int({ message: "Value must be an integer" })
  .positive({ message: "Value must be greater than zero" })

export { PositiveIntegerSchema }