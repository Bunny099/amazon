import { type Request,type Response } from "express"
import { createCart } from "../services/custonmer.service.js";
import {CartSchema }from "../lib/zod/customer.schema.js"


export const createCartCustomerController = async(req:Request,res:Response)=>{
    try{
        const input = {...req.body,user:req.user}
        const parse = CartSchema.safeParse(input)
        if(!parse.success){
            return res.status(401).json({message:"Invalid fields!"})
        }
        
        const response = await createCart(parse.data);
        
        return res.status(201).json({response,message:"product added to cart!"})

    }catch(e:any){
        return res.status(500).json({message:e.message || "Sever error!"})
    }
}


export const createOrderCustomerController = async(req:Request,res:Response)=>{
    try{

    }catch(e:any){
        return res.status(500).json({message:e.message || "Server error!"})
    }
}

export const cancleOrderCustomerController = async(req:Request,res:Response)=>{
    try{

    }catch(e:any){
        return res.status(500).json({message:e.message || "Server error!"})
    }
}