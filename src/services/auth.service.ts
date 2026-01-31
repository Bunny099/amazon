import type { CreateUserInput } from "../lib/zod/auth.schema.js"
import type { LoginUserInput } from "../lib/zod/auth.schema.js";
import { db } from "../lib/db.js";
import bcrypt from "bcryptjs";
import jwt  from "jsonwebtoken";
import "dotenv/config"

const AUTH_SECRET = process.env.AUTH_SECRET
if(!AUTH_SECRET){
    throw new Error("Auth secret not found!")
}

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
export const loginCheck  = async(data:LoginUserInput)=>{
    const {email,password,role} = data;
    const existingUser = await db.user.findUnique({where:{email,role}});
    if(!existingUser){
        throw new Error("No user found!")
    }
    const userCheck = await bcrypt.compare(password,existingUser.password);
    if(!userCheck){
        throw new Error("Password doesn't match!")
    }
    const token = jwt.sign({id:existingUser.id,role:existingUser.role},AUTH_SECRET,{expiresIn:"1hr"});
    return token;
}