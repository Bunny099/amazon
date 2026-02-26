import { Prisma } from "../generated/prisma/client.js";
import { db } from "../lib/db.js";
import type { CartInput } from "../lib/zod/customer.schema.js";

export const createCart = async (data: CartInput) => {
    const { user, productId } = data;
    if (user.role !== "Customer") {
        throw new Error("Not authorized!")
    }
    const response = await db.$transaction(async (tx) => {
        let cartExist = await tx.cart.findFirst({ where: { customerId: user.id } });
       
        
        if (cartExist) {
            let isProductAlreadyExist = await tx.cartItem.findFirst({ where: { productId, cartId: cartExist?.id } });
            if (isProductAlreadyExist) {
                return isProductAlreadyExist;
            } else {
                let response = await tx.cartItem.create({ data: { productId, cartId: cartExist.id } });
                return response;
            }

        } else {
            let cart = await tx.cart.create({ data: { customerId: user.id } });
            let response = await tx.cartItem.create({ data: { productId, cartId: cart.id } });
            return response;
        }

    }, {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        maxWait: 20000,
        timeout: 20000
    })

    return response;


};

export const createOrder = async () => { };

export const cancleOrder = async () => { };