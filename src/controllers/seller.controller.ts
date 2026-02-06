import { type Request, type Response } from "express"
import { createProduct, fetchProduct, patchProuct, deleteProduct } from "../services/seller.service.js";
import { UserSchema } from "../lib/zod/auth.schema.js";
import { ProductDeleteSchema, ProductPatchSchema, ProductSchema } from "../lib/zod/seller.product.js";



export const getSellerProductController = async (req: Request, res: Response) => {
    try {
       
        const input = {user:req.user};
        
        const parseUser = UserSchema.safeParse(req.user)
        if (!parseUser.success) {
            return res.status(401).json({ message: "Invalid fields!" })
        }
        
        const response = await fetchProduct(parseUser.data);
        return res.status(200).json({ response, message: "Products found!" })
    } catch (e: any) {
        return res.status(500).json({ message: e.message || "Server error!" })
    }
}
export const sellerProductController = async (req: Request, res: Response) => {
    try {
        
        const input = { ...req.body, user: req.user }
        
        const pasedProduct = ProductSchema.safeParse(input)
        if (!pasedProduct.success) {
            return res.status(400).json({ message: "Invalid fields!" })
        }
        const response = await createProduct(pasedProduct.data);
        return res.status(201).json({ response, message: "Product created!" })

    } catch (e: any) {
        return res.status(500).json({ message: e.message || "Server error!" })
    }
}

export const sellerPatchController = async (req: Request, res: Response) => {
    try {
        
        const productId = Array.isArray(req.params.productId) ? req.params.productId[0] : req.params.productId;
        const input = { ...req.body, productId, user: req.user }
        const parsePatchProduct = ProductPatchSchema.safeParse(input);
        if (!parsePatchProduct.success) {
            return res.status(400).json({ message: "Invalid Fields!" })
        }
        const response = await patchProuct(parsePatchProduct.data)
        return res.status(200).json({ response, message: "Product updated!" })

    } catch (e: any) {
        return res.status(500).json({ message: e.message || "Sever error!" })
    }
}

export const deleteProductController = async (req: Request, res: Response) => {
    try {
        
        const productId = Array.isArray(req.params.productId) ? req.params.productId[0] : req.params.productId;
        const input = { productId, user: req.user }
        const parseDeleteProduct = ProductDeleteSchema.safeParse(input);
        if (!parseDeleteProduct.success) {
            return res.status(400).json({ message: "Invalid fields!" })
        }
        const response = await deleteProduct(parseDeleteProduct.data)
        return res.status(200).json({ response, message: "Product deleted!" })
    } catch (e: any) {
        return res.status(500).json({ message: e.message || "Server error!" })
    }
}