import { Router } from "express";
import { middleware } from "../middleware/middleware.js";
import { createCartCustomerController, cancelOrderCustomerController, createOrderCustomerController, getCartCustomerController, editCartCustomerController, deleteCartCustomerController } from "../controllers/customer.controller.js";

export const customerRouter = Router();


//customer cart and cartItem
customerRouter.post("/cart", middleware, createCartCustomerController);
customerRouter.get("/cart", middleware, getCartCustomerController);
customerRouter.patch("/cart/:productId", middleware, editCartCustomerController);
customerRouter.delete("/cart/:productId", middleware, deleteCartCustomerController)


//customer order
customerRouter.post("/checkout", middleware, createOrderCustomerController)


//customer canclation-return
customerRouter.patch("/order/:orderId/cancel", middleware, cancelOrderCustomerController)