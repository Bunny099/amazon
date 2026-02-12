import { type Request,type Response } from "express"
import { createCart } from "../services/custonmer.service.js";



export const createCartCustomerController = async(req:Request,res:Response)=>{
    try{
        const user = req.user;
        const {productId} = req.body;
        if(!user){
            return res.status(401).json({message:"Unauthorized!"})
        }
        if(!productId){
            return res.status(400).json({message:"Field missing!"})
        }
        const response = await createCart({user,productId});
        
        return res.status(201).json({response,message:"product added to cart!"})

    }catch(e:any){
        return res.status(500).json({message:e.message || "Sever error!"})
    }
}


