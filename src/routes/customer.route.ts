import { Router } from "express";
import { middleware } from "../middleware/middleware.js";

export const customerRouter = Router();

customerRouter.post("/",middleware,)