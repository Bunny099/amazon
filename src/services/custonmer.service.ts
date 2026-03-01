import { REFUSED } from "node:dns";
import { Prisma } from "../generated/prisma/client.js";
import { db } from "../lib/db.js";
import type { CartInput, OrderInput } from "../lib/zod/customer.schema.js";

export const createCart = async (data: CartInput) => {
    const { user, productId ,quantity} = data;
    if (user.role !== "Customer") {
        throw new Error("Not authorized!")
    }
    
    let product = await db.product.findUnique({where:{id:productId}});
    if(!product){
        throw new Error("Product not found!")
    }
    const response = await db.$transaction(async (tx) => {
        let cartExist = await tx.cart.findUnique({ where: { customerId: user.id} });
        
        if (cartExist) {
            let isProductAlreadyExist = await tx.cartItem.findFirst({ where: { productId:product.id, cartId: cartExist?.id } });
            if (isProductAlreadyExist) {
                return isProductAlreadyExist;
            } else {
                let response = await tx.cartItem.create({ data: { productId:product?.id, cartId: cartExist.id ,quantity} });
                return response;
            }

        } else {
            let cart = await tx.cart.create({ data: { customerId: user.id } });
            let response = await tx.cartItem.create({ data: { productId:product.id, cartId: cart.id ,quantity} });
            return response;
        }

    }, {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        maxWait: 20000,
        timeout: 20000
    })
    return response;


};

export const createOrder = async (data:OrderInput) => { 
   
};

export const cancleOrder = async () => { };