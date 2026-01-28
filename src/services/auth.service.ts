import type { CreateUserInput } from "../lib/zod/auth.schema.js"
import { db } from "../lib/db.js";
import bcrypt from "bcryptjs";
export const createUser = async(data:CreateUserInput)=>{
    const {name,email,password,role} = data;
    const existingUser = await db.user.findUnique({where:{email}});
    if(existingUser){
        throw new Error("User already exist!")
    }
    const hassPassword = await bcrypt.hash(password,6);
    const response = await db.user.create({data:{name,email,password:hassPassword,role}});
    if(!response){
        throw new Error("Creating user failed!")
    }
    return {id:response.id,email:response.email,rname:response.name,ole:response.role,createdAt:response.createdAt,updatedAt:response.updatedAt};
}
export const loginCheck  = async()=>{}