import { JwtPayload } from "jsonwebtoken";
import type { Role } from "../lib/zod/auth.schema.ts";

declare global{
    namespace Express{
        interface Request{
            user?:{
                id:string,
                role:Role
            }
        }
    }
}