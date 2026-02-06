import { Router } from "express";
import { middleware } from "../middleware/middleware.js";
import { sellerProductController ,sellerPatchController,getSellerProductController,deleteProductController} from "../controllers/seller.controller.js";

export const sellerRouter = Router()
sellerRouter.get("/product",middleware,getSellerProductController)
sellerRouter.post("/product",middleware,sellerProductController)
sellerRouter.patch("/product/:productId",middleware,sellerPatchController)
sellerRouter.delete("/product/:productId",middleware,deleteProductController)