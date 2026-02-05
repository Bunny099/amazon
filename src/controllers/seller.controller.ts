import { type Request,type Response } from "express"
import { createProduct,fetchProduct,patchProuct, deleteProduct } from "../services/seller.service.js";



export const getSellerProductController = async(req:Request,res:Response)=>{
    try{
        const user = req.user;
        if(!user){
            return res.status(401).json({message:"Unauthorized!"})
        }
        const response = await fetchProduct(user);
        return res.status(200).json({response,message:"Products found!"})
    }catch(e:any){
        return res.status(500).json({message:e.message || "Server error!"})
    }
}
export const sellerProductController = async(req:Request,res:Response)=>{
    try{
        const {name,price} = req.body;
        const user = req.user;
        if(!user){
            return res.status(401).json({message:"Unauthorized!"})
        } 
        if(!name){
            return res.status(400).json({message:"Field missing!"})
        }
        const response = await createProduct({user,name,price});
        return res.status(201).json({response,nessage:"Product created!"})
       
    }catch(e:any){
        return res.status(500).json({message:e.message || "Server error!"})
    }
}

export const sellerPatchController = async(req:Request,res:Response)=>{
    try{
        const {productId,price} = req.params;
        const user = req.user;
        if(!user){
            return res.status(401).json({message:"Unauthorized!"})
        }
        if(!productId || !price){
            return res.status(400).json({message:"Field missing!"})
        }
        const response = await patchProuct({user,productId,price})
        return res.status(200).json({response,message:"Product updated!"})

    }catch(e:any){
        return res.status(500).json({message:e.message || "Sever error!"})
    }
}

export const deleteProductController = async(req:Request,res:Response)=>{
    try{
        const {productId} = req.params;
        const user = req.user;
        if(!user){
            return res.status(401).json({message:"Unauthorized!"})
        }
        if(!productId){
            return res.status(400).json({message:"Field missing!"})
        }
        const response = await deleteProduct({productId,user})
        return res.status(200).json({response,message:"Product deleted!"})
    }catch(e:any){
        return res.status(500).json({message:e.message || "Server error!"})
    }
}