import { type Request,type Response } from "express"
import { createProduct } from "../services/seller.service.js";
export const sellerController = async(req:Request,res:Response)=>{
    try{
        const {name} = req.body;
        const user = req.user;
        if(!user){
            return res.status(401).json({message:"Unauthorized!"})
        } 
        if(!name){
            return res.status(400).json({message:"Field missing!"})
        }
        const response = await createProduct({user,name});
        return res.status(201).json({response,nessage:"Product created!"})
       
    }catch(e:any){
        return res.status(500).json({message:e.message || "Server error!"})
    }
}