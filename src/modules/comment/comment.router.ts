import{ Router } from "express";
import { commentController } from "./comment.controller";
import auth, { userRole } from "../../middlewere/auth";


const router = Router()
router.post("/",
    auth(userRole.USER,userRole.ADMIN),
    commentController.createComment
)

router.get("/:commentId",
    commentController.getCommentById
)

router.get("/author/:authorId",
    commentController.getCommentByAuthor
)

router.delete("/:commentId",
    auth(userRole.ADMIN,userRole.USER),
    commentController.deleteComment
)

router.patch("/:commentId",
    auth(userRole.ADMIN,userRole.USER),
    commentController.updateComment
)

router.patch("/moderate/:commentId",
    auth(userRole.ADMIN),
    commentController.modreateComment
)
    
export const commentRouter = router
