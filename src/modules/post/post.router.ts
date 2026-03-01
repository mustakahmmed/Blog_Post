import express, { NextFunction, Request, Response } from "express";
import { postController } from "./post.controller";
import auth, { userRole } from "../../middlewere/auth";



 
const router = express.Router()

router.get("/",
    postController.getAllPosts
)

router.post("/",
    auth(userRole.USER,userRole.ADMIN),
    postController.createPosts
)
// place the more specific route before the dynamic :postId route
router.get("/my-posts",
    auth(userRole.USER,userRole.ADMIN),
    postController.getMyPosts
)

router.get("/stats",
    auth(userRole.ADMIN),
    postController.getStats
)


router.get("/:postId",
    postController.getPostById
)

router.patch("/:postId",
    auth(userRole.ADMIN,userRole.USER),
    postController.updateMyPost
)

router.delete("/:postId",
    auth(userRole.ADMIN,userRole.USER),
    postController.deletePost
)


export const postRouter = router;