import * as z from "zod";
import { UserSchema } from "./auth.schema.js";

export const CartSchema = z.object({
    productId:z.string(),
    user:UserSchema
})

export const OrderSchema = z.object({
    sellerId:z.string(),
    productId:z.string(),
    priceAtPurchase:z.string(),
    user:UserSchema

})

export type CartInput =z.infer<typeof CartSchema>
export type OrderInput = z.infer<typeof OrderSchema>