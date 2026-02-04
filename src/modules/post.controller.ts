import { Request, Response } from "express";
import { postService } from "./post.service";



const createPosts = async (req:Request,res:Response)=>{
    console.log(req.user);

    
    try {

    const user = req.user
    if (!user) {
        return res.status(400).json({
        message:"you are not authorize",

        })
    }
        const posts = await postService.createPost(req.body,user.id as string)
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

const getAllPosts = async(req:Request,res:Response)=>{
    try {
        const {search} = req.query
        const tags = req.query.tags? (req.query.tags as string).split(","):[];

        const serchType = typeof search === "string" ? search:undefined
        const result = await postService.getAllPost({search:serchType,tags})
        res.status(200).json(result)
    } catch (error) {
       res.status(400).json({
        message:"gat post failed"
       }) 
    }
}

export const postController = {
    createPosts,
    getAllPosts
}