import express from "express"
import cors from "cors"
import { postRouter } from "./modules/post/post.router"
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { commentRouter } from "./modules/comment/comment.router";
import errorHandler from "./middlewere/globalErrorHandler";



const app = express()
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json())

app.use(cors({
    origin:process.env.APP_URL || "http://localhost:4000",
    credentials:true
}))


app.use("/post",postRouter)
app.use("/comment",commentRouter)

app.use(errorHandler)
export default app