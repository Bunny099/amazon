import { type Request, type Response } from "express"
import { createCart, createOrder, getCart, editCart, deleteCart, cancelOrder } from "../services/customer.service.js";
import { CartDeleteSchema, CartSchema, OrderCancelSchema, OrderSchema } from "../lib/zod/customer.schema.js"
import { UserSchema } from "../lib/zod/auth.schema.js";


export const createCartCustomerController = async (req: Request, res: Response) => {
    try {
        const input = { ...req.body, user: req.user }
        const parse = CartSchema.safeParse(input)
        if (!parse.success) {
            return res.status(400).json({ message: "Invalid fields!" })
        }

        const response = await createCart(parse.data);

        return res.status(201).json({ response, message: "product added to cart!" })

    } catch (e: any) {
        return res.status(500).json({ message: e.message || "Sever error!" })
    }
}

export const getCartCustomerController = async (req: Request, res: Response) => {
    try {
        const user = req.user;;
        if (!user) {
            throw new Error("Invalid Field!")
        }
        const response = await getCart(user);
        return res.status(200).json({ response, message: "Cart fetch successfully!" })
    } catch (e: any) {
        return res.status(500).json({ message: e.message || "Server Error!" })
    }

};

export const editCartCustomerController = async (req: Request, res: Response) => {
    try {
        const input = { ...req.body, ...req.params, user: req.user };
        const parse = CartSchema.safeParse(input);
        if (!parse.success) {
            throw new Error("Invalid fields!")
        }
        const response = await editCart(parse.data)
        return res.status(200).json({ response, message: "Cart item updated!" })
    } catch (e: any) {
        return res.status(500).json({ message: e.message || "Server Error!" })
    }

};
export const deleteCartCustomerController = async (req: Request, res: Response) => {
    try {
        const input = { ...req.body, user: req.user };
        const parse = CartDeleteSchema.safeParse(input)
        if (!parse.success) {
            throw new Error("Invalid fields!")
        }

        const resposne = await deleteCart(parse.data);
        return res.status(200).json({ message: "Cart item deleted!" })
    } catch (e: any) {
        return res.status(500).json({ message: e.message || "Server Error!" })
    }

};

export const createOrderCustomerController = async (req: Request, res: Response) => {
    try {
        const input = { ...req.body, user: req.user };
        const parse = OrderSchema.safeParse(input);
        if (!parse.success) {
            throw new Error("Invalid fields!");
        }
        const response = await createOrder(parse.data)
        return res.status(200).json({ response, message: "Ordered!" })
    } catch (e: any) {
        return res.status(500).json({ message: e.message || "Server error!" })
    }
}

export const cancelOrderCustomerController = async (req: Request, res: Response) => {
    try {
        const input = { ...req.params, user: req.user };
        const parse = OrderCancelSchema.safeParse(input);
        if (!parse.success) {
            throw new Error("Invalid fields");
        }
        const response = await cancelOrder(parse.data);
        return res.status(200).json({ response, message: "Order cancel" })
    } catch (e: any) {
        return res.status(500).json({ message: e.message || "Server error!" })
    }
}