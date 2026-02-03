import express  from "express";
import cors from "cors"
import { authRouter } from "./routes/auth.route.js";
import { customerRouter } from "./routes/customer.route.js";
import { sellerRourer } from "./routes/seller.route.js";
import { adminRouter } from "./routes/admin.route.js";
import { middleware } from "./middleware/middleware.js";
const app = express();

app.use(express.json())
app.use(cors());

app.use("/auth",authRouter)
app.use("/customer",customerRouter)
app.use("/seller",sellerRourer)
app.use("/admin",adminRouter)
export default app;