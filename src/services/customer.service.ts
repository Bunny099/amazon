import { REFUSED } from "node:dns";
import { Prisma } from "../generated/prisma/client.js";
import { db } from "../lib/db.js";
import type { CartDeleteInput, CartInput, OrderInput } from "../lib/zod/customer.schema.js";
import type { User } from "../lib/zod/auth.schema.js";

export const createCart = async (data: CartInput) => {
    const { user, productId, quantity } = data;
    if (user.role !== "Customer") {
        throw new Error("Not authorized!")
    }

    let product = await db.product.findUnique({ where: { id: productId } });
    if (!product) {
        throw new Error("Product not found!")
    }
    const response = await db.$transaction(async (tx) => {
        let cartExist = await tx.cart.findUnique({ where: { customerId: user.id } });

        if (cartExist) {
            let isProductAlreadyExist = await tx.cartItem.findFirst({ where: { productId: product.id, cartId: cartExist?.id } });
            if (isProductAlreadyExist) {
                return isProductAlreadyExist;
            } else {
                let response = await tx.cartItem.create({ data: { productId: product?.id, cartId: cartExist.id, quantity } });
                return response;
            }

        } else {
            let cart = await tx.cart.create({ data: { customerId: user.id } });
            let response = await tx.cartItem.create({ data: { productId: product.id, cartId: cart.id, quantity } });
            return response;
        }

    }, {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        maxWait: 20000,
        timeout: 20000
    })
    return response;


};


export const getCart = async (data: User) => {
    const user = data;
    if (user.role !== "Customer") {
        throw new Error("Not authorized!")
    }
    const response = await db.cart.findUnique({ where: { customerId: user.id }, include: { cartItems: true } });
    if (!response) {
        throw new Error("Cart not found!")
    }
    return response;
}

export const editCart = async (data: CartInput) => {
    const { productId, quantity, user } = data;
    if (user.role !== "Customer") {
        throw new Error("Not authorized!")
    }

    const cart = await db.cart.findUnique({ where: { customerId: user.id } });
    if (!cart) {
        throw new Error("Cart not found!")
    }
    const cartItemExist = await db.cartItem.findUnique({ where: { cartId_productId: { productId, cartId: cart.id } } })
    if (!cartItemExist) {
        throw new Error("Cart Item not exist with thsi product!")
    }
    const updatedCart = await db.cartItem.update({ where: { cartId_productId: { productId, cartId: cart.id } }, data: { quantity } });
    if (!updatedCart) {
        throw new Error("Failed to updated cart!")
    }
    return updatedCart;
}

export const deleteCart = async (data: CartDeleteInput) => {
    const { productId, user } = data;
    if (user.role !== "Customer") {
        throw new Error("Not authorized!")
    }
    const cart = await db.cart.findUnique({ where: { customerId: user.id } });
    if (!cart) {
        throw new Error("Cart not found!")
    }
    const cartItemExist = await db.cartItem.findUnique({ where: { cartId_productId: { productId, cartId: cart.id } } })
    if (!cartItemExist) {
        throw new Error("Cart Item not exist with thsi product!")
    }
    const deleteCartItem = await db.cartItem.delete({ where: { cartId_productId: { productId, cartId: cart.id } } });
    if (!deleteCartItem) {
        throw new Error("Failed to delete cart item!")
    }
    return deleteCartItem;
}


export const createOrder = async (data: OrderInput) => {

};

export const cancleOrder = async () => { };