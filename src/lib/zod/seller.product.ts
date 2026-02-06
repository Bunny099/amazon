import * as z from "zod"
import { UserSchema } from "./auth.schema.js"

export const ProductSchema = z.object({
    name:z.string().min(3).max(100),
    price:z.number().int().nonnegative(),
    user:UserSchema,
   

})
export const ProductPatchSchema = z.object({
    price:z.number().int().nonnegative(),
    user:UserSchema,
    productId:z.string()
})
export const ProductDeleteSchema = z.object({
     user:UserSchema,
    productId:z.string()
})
export type ProductInputData = z.infer<typeof ProductSchema>
export type ProductPatchData = z.infer<typeof ProductPatchSchema>
export type ProductDeleteData = z.infer<typeof ProductDeleteSchema>