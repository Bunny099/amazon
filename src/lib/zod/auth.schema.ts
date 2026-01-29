import * as z from "zod";

export const RoleEnum = z.enum(["Customer","Seller","Admin"])
export const CreateUserSchema = z.object({
     name:z.string().min(2).max(80),
    email:z.email(),
    password:z.string().min(6).max(80),
    role:RoleEnum.default("Customer")
})
export const UserLoginSchema = z.object({
    email:z.email(),
    password:z.string().min(6).max(80),
    role:RoleEnum.default("Customer")
})
export type CreateUserInput = z.infer<typeof CreateUserSchema>  
export type LoginUserInput = z.infer<typeof UserLoginSchema>