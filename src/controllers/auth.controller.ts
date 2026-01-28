import { type Request, type Response } from "express";
import { CreateUserSchema } from "../lib/zod/auth.schema.js";
import { createUser } from "../services/auth.service.js";

export const register = async (req: Request, res: Response) => {
    try {
        const parsed = CreateUserSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error, message: "Invalid fields" })
        }
        const response = await createUser(parsed.data)
        return res.status(201).json({ response, message: "User created!" })
    } catch (e: any) {
        return res.status(500).json({ message: e.error || "Server error" })
    }

}

export const login = async (req: Request, res: Response) => { }



