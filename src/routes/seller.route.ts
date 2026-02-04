import { Router } from "express";
import { middleware } from "../middleware/middleware.js";
import { sellerController } from "../controllers/seller.controller.js";

export const sellerRourer = Router()
sellerRourer.post("/product",middleware,sellerController)