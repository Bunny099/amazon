import { Router } from "express";
import { middleware } from "../middleware/middleware.js";
import { createCartCustomerController,cancleOrderCustomerController,createOrderCustomerController } from "../controllers/customer.controller.js";

export const customerRouter = Router();


//customer cart and cartItem
customerRouter.post("/cart",middleware,createCartCustomerController)

//customer order
customerRouter.post("/order",middleware,createOrderCustomerController)

//customer canclation-return
customerRouter.post("/order/cancle",middleware,cancleOrderCustomerController)