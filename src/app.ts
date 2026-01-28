import express from "express"
import cors from "cors"
import { postRouter } from "./modules/post.router"



const app = express()

app.use(express.json())
app.use(cors({
    origin:process.env.APP_URL || "http://localhost:4000",
    credentials:true
}))


app.use("/",postRouter)
export default app