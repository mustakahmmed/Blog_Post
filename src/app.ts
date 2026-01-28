import express from "express"
import cors from "cors"
import { postRouter } from "./modules/post.router"
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";



const app = express()
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json())

app.use(cors({
    origin:process.env.APP_URL || "http://localhost:4000",
    credentials:true
}))


app.use("/",postRouter)
export default app