import { db } from "../lib/db.js";
import type { Role } from "../lib/zod/auth.schema.js"
import type { ProductInputData } from "../lib/zod/seller.product.js";
import type { User } from "../lib/zod/auth.schema.js";
import type { ProductPatchData } from "../lib/zod/seller.product.js";
import type { ProductDeleteData } from "../lib/zod/seller.product.js";


export const fetchProduct = async (data: User) => {
    const user = data;
    if (user.role !== "Seller") {
        throw new Error("Not authorized!")
    }
    const response = await db.product.findMany({ where: { sellerId: user.id } });
    if (!response) {
        throw new Error("Products not found!")
    }
    return response;
}
export const createProduct = async (data: ProductInputData) => {
    const { name, price, user } = data;
    if (user.role !== "Seller") {
        throw new Error("Not authorized!")
    }
    const response = await db.product.create({ data: { name, price, sellerId: user.id } });
    if (!response) {
        throw new Error("Product not created!")
    }
    return response;
}
export const patchProuct = async (data: ProductPatchData) => {
    const { user, productId, price } = data;
    if (user.role !== "Seller") {
        throw new Error("Not authorized!")
    }
    const isProductExist = await db.product.findFirst({where:{id:productId,sellerId:user.id}});
    if(!isProductExist){
        throw new Error("Product not found!")
    }
    const response = await db.product.update({ where: { id: productId, sellerId: user.id }, data: { price } });
    if (!response) {
        throw new Error("Failed to update product!")
    }
    return response;

}

export const deleteProduct = async (data: ProductDeleteData) => {
    const { user, productId } = data;
    if (user.role !== "Seller") {
        throw new Error("Not authorized!")
    }
    const isProductExist = await db.product.findFirst({where:{id:productId,sellerId:user.id}});
    if(!isProductExist){
        throw new Error("Product not found!")
    }
    const response = await db.product.delete({ where: { id: productId } });
    if (!response) {
        throw new Error("Product not deleted!")
    }
    return response
}