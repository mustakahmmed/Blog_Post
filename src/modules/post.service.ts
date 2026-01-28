import { Post } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";

const createPost = async (data: Omit<Post, "id" | "createdAt" | "updatedAt">) =>{
    const post = await prisma.post.create({
        data
    })
    return post
}
export const postService = {
    createPost
}