import * as z from "zod";
import { UserSchema } from "./auth.schema.js";

export const CartSchema = z.object({
    productId:z.string(),
    user:UserSchema
})

export type CartInput =z.infer<typeof CartSchema>