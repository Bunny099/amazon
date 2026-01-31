import { type Request,type Response,type NextFunction } from "express"
import "dotenv/config"
import jwt from "jsonwebtoken"

const AUTH_SECRET = process.env.AUTH_SECRET;
if(!AUTH_SECRET){
    throw new Error("Auth secret not found!")
}
export const middleware = async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader){
            return res.status(400).json({message:"Header is not present!"})
        }
        const token = authHeader?.split(" ")[1];
        if(!token){
            return res.status(404).json({message:"Token not found!"})
        }
        const decoded = jwt.verify(token,AUTH_SECRET);
        if(!decoded){
            return res.status(400).json({message:"Unauthorized!"})
            
        }
        (req as any).user = decoded;
        next();
    }catch(e){
        return res.status(500).json({message:"Server error!"})
    }
}