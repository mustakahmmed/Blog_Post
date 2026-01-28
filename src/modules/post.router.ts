import express from "express";
import { postController } from "./post.controller";
 
const router = express.Router()

router.post("/post",postController.createPosts)
export const postRouter = router;