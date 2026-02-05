import express  from "express";
import cors from "cors"
import { authRouter } from "./routes/auth.route.js";
import { customerRouter } from "./routes/customer.route.js";
import { sellerRouter } from "./routes/seller.route.js";
import { adminRouter } from "./routes/admin.route.js";
const app = express();

app.use(express.json())
app.use(cors());

app.use("/auth",authRouter)
app.use("/customer",customerRouter)
app.use("/seller",sellerRouter)
app.use("/admin",adminRouter)
export default app;