import { Request, Response } from "express";
import { postService } from "./post.service";
import { PostStatuss } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";
import { date } from "better-auth";
import { prisma } from "../../lib/prisma";
import { error } from "node:console";
import { userRole } from "../../middlewere/auth";



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

const getMyPosts = async(req:Request,res:Response) => {
    try {
        const user = req.user;
        console.log(user);
        if (!user) {
            throw new Error("you are unauthorize");
        }
        const result = await postService.getMyPosts(user.id as string);
        return res.status(200).json({
            message: "my posts fetched",
            data: result
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: "post fetched failed",
            data: error
        });
    }
}

const updateMyPost = async(req:Request,res:Response) => {
    try {
        const user = req.user
        const {postId} = req.params
        const isAdmin = user?.role === userRole.ADMIN
        console.log(user);
        
        if (!user) {
            throw new Error("you are not authorize")
        }
        const result = await postService.updateMyPost(postId as string,req.body,user.id,isAdmin)
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json({
            message:"updating post failed",
            data:error
        })
    }
}

const deletePost = async(req:Request,res:Response) => {
    try {
        const user = req.user
        const {postId} = req.params
        const isAdmin = user?.role === userRole.ADMIN
        console.log(user);
        
        if (!user) {
            throw new Error("you are not authorize")
        }
        const result = await postService.deletePost(postId as string,user.id,isAdmin)
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json({
            message:"deleting post failed",
            data:error
        })
    }
} 

const getStats = async(req:Request,res:Response) => {
    try {
        const result = await postService.getStats()
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json({
            message:"deleting post failed",
            data:error
        })
    }
}


export const postController = {
    createPosts,
    getAllPosts,
    getPostById,
    getMyPosts,
    updateMyPost,
    deletePost,
    getStats
}