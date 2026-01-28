import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config"

const DATABASE = process.env.DATABASE_URL;
if(!DATABASE){
    throw new Error("Databse url not found!")
}
const adapter = new PrismaPg({
    connectionString: DATABASE
})
export const db = new PrismaClient({adapter})