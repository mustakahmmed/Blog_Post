import { title } from "node:process";
import { Post } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";

const createPost = async (data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">, userId:string) =>{
    const post = await prisma.post.create({
        data:{
            ...data,
            authorId:userId
        }
    })
    return post
}

const getAllPost = async(payload:{
    search?:string | undefined,
    tags:string[] | []
})=>{
    const allPost = await prisma.post.findMany({
        where:{
            AND:[
            {    OR:[
                {
                    title:{
                        contains:payload.search as string,
                        mode:"insensitive"
                    }
                },
                {
                    content:{
                        contains:payload.search as string,
                        mode:"insensitive"
                    }
                },
                {
                    tag:{
                        has:payload.search as string
                    }
                }
            ]},
{            tag:{
                hasEvery:payload.tags as string[]
            }}
            ]
        }
    })
    return allPost
}

export const postService = {
    createPost,
    getAllPost
}