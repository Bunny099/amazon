import { Router } from "express";
import { middleware } from "../middleware/middleware.js";
import { sellerProductController ,sellerPatchController,getSellerProductController,deleteProductController , getSellerInventory,createInventoryController} from "../controllers/seller.controller.js";

export const sellerRouter = Router()
//seller products
sellerRouter.get("/product",middleware,getSellerProductController);
sellerRouter.post("/product",middleware,sellerProductController);
sellerRouter.patch("/product/:productId",middleware,sellerPatchController);
sellerRouter.delete("/product/:productId",middleware,deleteProductController);

//Inventories
sellerRouter.get("/inventory/:productId",middleware,getSellerInventory);
sellerRouter.post("/inventory",middleware,createInventoryController);

