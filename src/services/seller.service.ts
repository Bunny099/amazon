import { db } from "../lib/db.js";
import type { Role } from "../lib/zod/auth.schema.js"

interface ProductData{
    name:string,
    user:{
        id:string,
        role:Role
    }
}
export const createProduct = async(data:ProductData)=>{
    const {name,user} = data;
    if(user.role !=="Seller"){
        throw new Error("Not authorized!")
    }
    const response = await db.product.create({data:{name}});
    if(!response){
        throw new Error("Product not created!")
    }
    return response;
}