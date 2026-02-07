import * as z from "zod";
import { UserSchema } from "./auth.schema.js";


export const InventoriesFetchSchema = z.object({
    productId:z.string(),
    user:UserSchema
})

export const InventoriesSchema = z.object({
    productId:z.string(),
    availableQty:z.number().int().nonnegative(),
    soldQty:z.number().int().nonnegative(),
    reservedQty:z.number().int().nonnegative(),
    user:UserSchema
})

export type InventoriesInputFetchData = z.infer<typeof InventoriesFetchSchema>
export type InventoryInputData = z.infer<typeof InventoriesSchema>
