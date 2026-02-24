import { Request, Response } from "express";
import { postService } from "./post.service";
import { PostStatuss } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";



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

    const {page,limit,skip,sortBy,sortOrder} = paginationSortingHelper(req.query)


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

const getPostById = async(req:Request,res:Response)=>{
    try {
        const { postId } = req.params;
        const id = Array.isArray(postId) ? postId[0] : postId;
       
        if (!id) {
            throw new Error("post id requred");
        }
        const result = await postService.getPostById(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({
            message:"get post by id is failed",
            data:error
        })
    }
}

export const postController = {
    createPosts,
    getAllPosts,
    getPostById
  
}