import { Prisma } from "../generated/prisma/client.js";
import { db } from "../lib/db.js";
import type { User } from "../lib/zod/auth.schema.js";
interface CartDataInput {
    user: User,
    productId: string
}
export const createCart = async (data: CartDataInput) => {
    const { user, productId } = data;
    if (user.role !== "Customer") {
        throw new Error("Not authorized!")
    }
    const response = await db.$transaction(async (tx) => {
        let cartExist = await tx.cart.findFirst({where:{customerId:user.id}});
        if(cartExist){
            let response =await tx.cartItem.create({data:{productId,cartId:cartExist.id}});
            return response;
        }else{
            let cart = await tx.cart.create({data:{customerId:user.id}});
            let response = await tx.cartItem.create({data:{productId,cartId:cart.id}});
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