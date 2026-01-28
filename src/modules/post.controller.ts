import { Request, Response } from "express";
import { postService } from "./post.service";


const createPosts = async (req:Request,res:Response)=>{
    try {
        const posts = await postService.createPost(req.body)
        res.status(201).json({
            message:"post Created",
            data:posts
        })
    } catch (error) {
        res.status(400).json({
            message:"Post creation failed",
            data:error
        })
    }
}

export const postController = {
    createPosts
}