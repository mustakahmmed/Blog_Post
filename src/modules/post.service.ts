import { title } from "node:process";
import { Post, PostStatuss } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";
import { PostWhereInput } from "../../generated/prisma/models";

const createPost = async (data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">, userId:string) =>{
    const post = await prisma.post.create({
        data:{
            ...data,
            authorId:userId
        }
    })
    return post
}

const getAllPost = async({search,tag,isFeatured,status,authorId}:{
    search: string | undefined,
    tag: string[] | [],
    isFeatured: boolean | undefined,
    status:PostStatuss | undefined,
    authorId:string |undefined
})=>{
    const andCondstions:PostWhereInput[] = [];

    if(search){
        andCondstions.push(
            {OR:[
        {
            title:{
            contains:search as string,
            mode:"insensitive"
        }
        },
        {
            content:{
                contains:search as string,
                mode:"insensitive"
            }
        },
        {
            tag:{
                has:search as string
            }
        }
       ]}
        )
    }
    if (tag.length>0) {
        andCondstions.push(
             {tag:{
        hasEvery:tag as string[]
       }}
        )
    }
   if (typeof isFeatured === "boolean") {
    andCondstions.push({
        isFeatured
    })
   }
   if (status) {
    andCondstions.push({
        status
    })
   }

   if (authorId) {
    andCondstions.push({authorId})
   }

 const allPost = await prisma.post.findMany({
    where:{
        AND:andCondstions
    }
 })
 return allPost
}

export const postService = {
    createPost,
    getAllPost
}