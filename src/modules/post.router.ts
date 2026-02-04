import express, { NextFunction, Request, Response } from "express";
import { postController } from "./post.controller";
import auth, { userRole } from "../middlewere/auth";



 
const router = express.Router()

router.get("/post",
    postController.getAllPosts
)

router.post("/post",
    auth(userRole.USER),
    postController.createPosts)
export const postRouter = router;