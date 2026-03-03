import * as z from "zod";
import { UserSchema } from "./auth.schema.js";

export const CartSchema = z.object({
    productId:z.string(),
    quantity:z.number().nonnegative(),
    user:UserSchema
})

export const CartDeleteSchema = z.object({
    productId:z.string(),
    user:UserSchema,
})


export const OrderSchema = z.object({
    user:UserSchema

})

export const OrderCancelSchema = z.object({
    user:UserSchema,
    orderId:z.string()
})

export type CartInput =z.infer<typeof CartSchema>
export type CartDeleteInput = z.infer<typeof CartDeleteSchema>
export type OrderInput = z.infer<typeof OrderSchema>
export type OrderCancelInput = z.infer<typeof OrderCancelSchema>