import { Request, Response } from "express";
import { postService } from "./post.service";
import { prisma } from "../lib/prisma";
import { PostStatuss } from "../../generated/prisma/enums";



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
    const searchType = typeof search === "string"? search :undefined
    const tag = req.query.tag ? (req.query.tag as string).split(",") : []
    const isFeatured = req.query.isFeatured? req.query.isFeatured === "true" : undefined 
    const status = req.query.status as PostStatuss
    const authorId = req.query.authorId as string;
    const page = Number(req.query.page ?? 1)
    const limit = Number(req.query.limit ?? 10)
    const skip = (page-1)*limit;
    const sortBy = req.query.sortBy as string | undefined;
    const sortOrder = req.query.sortOrder as string | undefined


    const allPost = await postService.getAllPost({
        search:searchType,
        tag,
        isFeatured,
        status,
        authorId,
        page,
        limit,
        skip,
        sortBy,
        sortOrder
    })
    

   
    res.status(200).json({allPost})
} catch (error) {
    res.status(400).json({
        message:"post creation faild",
        data:error
    })
    
}
}

export const postController = {
    createPosts,
    getAllPosts
}