import { REFUSED } from "node:dns";
import { Prisma } from "../generated/prisma/client.js";
import { db } from "../lib/db.js";
import type { CartDeleteInput, CartInput, OrderCancelInput, OrderInput } from "../lib/zod/customer.schema.js";
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
    const { user } = data;
    if (user.role !== "Customer") {
        throw new Error("Not authorized!")
    }
    const response = await db.$transaction(
        async (tx) => {
            //1.find cart
            const cart = await tx.cart.findUnique({ where: { customerId: user.id } });
            if (!cart) {
                throw new Error("cart not found!")
            }
            const cartItems = await tx.cartItem.findMany({ where: { cartId: cart.id } });
            if (cartItems.length === 0) {
                throw new Error("cart items not found!")
            }
            const productsIds = cartItems.map((i) => (i.productId));

            //2.find products
            const products = await tx.product.findMany({ where: { id: { in: productsIds } } });

            if (products.length !== cartItems.length) {
                throw new Error("Some products not found!")
            }

            //3.inventory update;
            for (let i of cartItems) {

                const result = await tx.inventory.updateMany({
                    where: {
                        productId: i.productId,
                        availableQty: { gte: i.quantity }
                    }, data: {
                        availableQty: { decrement: i.quantity },
                        reservedQty: { increment: i.quantity }
                    }
                })
                if (result.count === 0) {
                    throw new Error("Insufficient stock!")
                }
            }

            //4.creating order

            const order = await tx.order.create({ data: { customerId: user.id } });

            //5.creating orderitems using cartitems;

            for (let i of cartItems) {
                let product = products.find((p) => p.id === i.productId);

                await tx.orderItem.createMany({
                    data: {
                        orderId: order.id,
                        productId: i.productId,
                        sellerId: product!?.sellerId,
                        priceAtPurchase: product!?.price,
                        quantity: i.quantity,
                        status: "CREATED"
                    }
                })
            }

            //6.clearing a cart
            await tx.cartItem.deleteMany({ where: { cartId: cart.id } })

            return order;
        },
        {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
            maxWait: 30000,
            timeout: 30000
        }

    )
    return response;
}

export const cancelOrder = async (data: OrderCancelInput) => {
    const { user, orderId } = data;
    if (user.role !== "Customer") {
        throw new Error("Not authorized!")
    }
    const response = await db.$transaction(
        async (tx) => {
            const orderExist = await tx.order.findUnique({ where: { id: orderId } });
            if (!orderExist) {
                throw new Error("Order not found!");
            }
            if (orderExist.customerId !== user.id) {
                throw new Error("Wrong order!")
            }
            const orderItems = await tx.orderItem.findMany({ where: { orderId: orderExist.id } });
            if (orderItems.length === 0) {
                throw new Error("Order  items not found!")
            }
            for (let i of orderItems) {
                if (i.status !== "CREATED") {
                    throw new Error("order not found!")
                }
               let result = await tx.inventory.updateMany({
                    where: {
                        productId: i.productId,
                        reservedQty: { gte: i.quantity }
                    },
                    data: {
                        availableQty: { increment: i.quantity },
                        reservedQty: { decrement: i.quantity }
                    }
                })
                if(result.count === 0){
                    throw new Error("failed to restored Inventory!")
                }
                let orderCancel =await tx.orderItem.updateMany({
                    where: {
                        productId: i.productId,
                        orderId:orderExist.id,
                        status: "CREATED"
                    },
                    data: {
                        status: "CANCELED"
                    }
                })
                if(orderCancel.count === 0){
                    throw new Error("Failed to update ")
                }

            }

        },
        {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
            maxWait: 30000,
            timeout: 30000
        }
    )
    return response;
}