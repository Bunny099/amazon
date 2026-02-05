import { db } from "../lib/db.js";
import type { Role } from "../lib/zod/auth.schema.js"
type User ={id:string,role:Role}
interface ProductData{
    name:string,
    price:string,
    user:User
}
interface PatchProductData{
    productId:string | string[],
    price?:string | string[],
    user:User
}

export const fetchProduct = async(data:User)=>{
    const user = data;
    if(user.role !== "Seller"){
        throw new Error("Not authorized!")
    }
    const response = await db.product.findMany();
    if(!response){
        throw new Error("Products not found!")
    }
    return response;
}
export const createProduct = async(data:ProductData)=>{
    const {name,price,user} = data;
    if(user.role !=="Seller"){
        throw new Error("Not authorized!")
    }
    const response = await db.product.create({data:{name,price}});
    if(!response){
        throw new Error("Product not created!")
    }
    return response;
}
export const patchProuct = async(data:PatchProductData)=>{
    const {user,productId,price} = data;
    if(user.role  !== "Seller"){
        throw new Error("Not authorized!")
    }
   const response = await db.product.update({where:{id:productId as string},data:{price:price as string}});
   if(!response){
    throw new Error("Failed to update product!")
   }
   return response;
    
}

export const deleteProduct = async(data:PatchProductData)=>{
    const {user,productId} = data;
    if(user.role !== "Seller"){
        throw new Error("Not authorized!")
    }
    const response = await db.product.delete({where:{id:productId as string}});
    if(!response){
        throw new Error("Product not deleted!")
    }
    return response
}