import express, { NextFunction, Request, Response } from "express";
import { postController } from "./post.controller";
import auth, { userRole } from "../../middlewere/auth";



 
const router = express.Router()

router.get("/",
    postController.getAllPosts
)

router.post("/",
    auth(userRole.USER),
    postController.createPosts
)
router.get("/:postId",
    postController.getPostById
)


export const postRouter = router;