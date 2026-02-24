import { CommentStatus } from "../../../generated/prisma/enums"
import { prisma } from "../../lib/prisma"

const createComent = async(payloat: {
    containt: string,
    authorId:string,
    postId:string,
    parentId?:string
})=>{
    await prisma.post.findUniqueOrThrow({
        where:{
            id:payloat.postId
        }
    })
    if (payloat.parentId) {
        await prisma.comment.findUniqueOrThrow({
            where:{
                id:payloat.parentId
            }
        })
    }
    
    const result = await prisma.comment.create({
        data:payloat
    })
    return result
}

const getCommentById = async(id:string)=>{
    return await prisma.comment.findUnique({
        where:{
            id
        },
        include:{
            post:{
                select:{
                    id:true,
                    title:true
                }
            }
        }
    })
}

const getCommetByAuthor = async (authorId:string) =>{
    return await prisma.comment.findMany({
        where:{
           authorId
        },
        orderBy:{
            createdAt:"desc"
        },
        include:{
            post:{
                select:{
                    id:true,
                    title:true,
                    content:true 
                }
            }
        }
    })
    
}

const deleteComment = async(commentId:string,authorId:string)=>{
    const commentData = await prisma.comment.findFirst({
        where:{
            id:commentId,
            authorId
        },
            select:{
                id:true
            }
    })
    if (!commentData) {
        throw new Error("Your provided data invalid")
    }
    return await prisma.comment.delete({
        where:{
            id:commentData.id
        }
    })
}

const updateComment = async(commentId:string,data:{containt?:string,status?:CommentStatus},authorId:string) =>{
    const commentData = await prisma.comment.findFirst({
        where:{
            id:commentId,
            authorId
        },
            select:{
                id:true
            }
    })
    if (!commentData) {
        throw new Error("Your provided data invalid")
    }

    return await prisma.comment.update({
        where:{
            id:commentId,
            authorId
        },
        data
    })

}


export const commentService = {
    createComent,
    getCommentById,
    getCommetByAuthor,
    deleteComment,
    updateComment
}