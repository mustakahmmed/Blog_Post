
import { CommentStatus, Post, PostStatuss } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { PostWhereInput } from "../../../generated/prisma/models";
import { date, promise } from "better-auth";
import { userRole } from "../../middlewere/auth";


const createPost = async (data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">, userId:string) =>{
    const post = await prisma.post.create({
        data:{
            ...data,
            authorId:userId
        }
    })
    return post
}

const getAllPost = async({
    search,
    tag,
    isFeatured,
    status,
    authorId,
    page,
    limit,
    skip,
    sortBy,
    sortOrder
}:{
    search: string | undefined,
    tag: string[] | [],
    isFeatured: boolean | undefined,
    status:PostStatuss | undefined,
    authorId:string |undefined,
    page:number,
    limit:number,
    skip:number,
    sortBy: string,
    sortOrder: string 
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
    take:limit,
    skip,
    where:{
        AND:andCondstions
    },
    orderBy:{
        [sortBy]:sortOrder
    },
    include:{
        _count:{
            select:{
                comments:true
            }
        }
    }
    })
    const total = await prisma.post.count({
        where:{
            AND:andCondstions
            }
    })
 return {
    data:allPost,
    pagination:{
        total,
        page,
        limit,
        totalPage:Math.ceil(total/limit)
    }
 }
}

const getPostById = async(postId:string)=>{
  return  await prisma.$transaction(async(tx)=>{
        await tx.post.update({
        where:{id:postId},
        data:{
            views:{
                increment:1
            }
        }
    })
   
    const result = await tx.post.findUnique({
        where:{
            id:postId
        },
        include:{
            comments:{
                where:{
                    parentId:null,
                    status:CommentStatus.APPROVED
                },
                orderBy:{createdAt: "desc"},
                include:{
                    reply:{
                        where:{
                            status:CommentStatus.APPROVED
                        }
                    }
                },

            },
            _count:{
                select:{comments:true}
            }
        }
    })
    return result
    })
    
}

const getMyPosts = async(authorId:string) => {
   
    await prisma.user.findUniqueOrThrow({
        where:{
            id:authorId,
            status:"ACTIVE"
        },
        select:{
            id:true
        }
    })

    const posts = await prisma.post.findMany({
        where: { authorId },
        orderBy: { createdAt: "desc" },
        include:{
            _count:{
                select:{
                    comments:true
                }
            }
        }
    });
    const postCount = await prisma.post.count({
        where:{authorId}
    })
    return {
        date:posts,
        postCount
    }
} 

const updateMyPost = async(postId:string,data:Partial<Post>,authorId:string,isAdmin:boolean) => {

    const postData = await prisma.post.findUniqueOrThrow({
        where:{
             id:postId
        },
        select:{
            id:true,
            authorId:true
        }
    })
    if (!isAdmin && (postData.authorId !== authorId)) {
        throw new Error("you are not the owner of this post")
    }

    if (!isAdmin) {
        delete data.isFeatured
    }

    return await prisma.post.update({
        where:{
            id:postData.id
        },
        data
    })
}

const deletePost = async(postId:string,authorId:string,isAdmin:boolean) => {
    console.log(postId,authorId,isAdmin);
    const postData = await prisma.post.findUniqueOrThrow({
        where:{
            id:postId
        },
        select:{
            id:true,
            authorId:true
        }
    })
    
    if (!isAdmin && (postData.authorId !== authorId)) {
        throw new Error("you are not allowed to delete this post")
    }

    return await prisma.post.delete({
        where:{
            id:postData.id
        }
    })
}

const getStats = async() => {
return await prisma.$transaction(async(tx)=>{
    const [postCount,publishedPost,draftPost,archivedPost,totalComment,approvedComment,totalUsers,adminCount,userCount,totalView] = 
    await Promise.all([
        await tx.post.count(),
        await tx.post.count({where:{status:PostStatuss.PUBLIC}}),
        await tx.post.count({where:{status:PostStatuss.DRAFT}}),
        await tx.post.count({where:{status:PostStatuss.ARCHIVED}}),
        await tx.comment.count(),
        await tx.comment.count({where:{status:CommentStatus.APPROVED}}),
        await tx.comment.count({where:{status:CommentStatus.REJECTED}}),
        await tx.user.count(),
        await tx.user.count({where:{role:userRole.ADMIN}}),
        await tx.user.count({where:{role:userRole.USER}}),
        await tx.post.aggregate({_sum:{views:true}})

        

    ])

    return {
    postCount,
    publishedPost,
    draftPost,
    archivedPost,
    totalComment,
    approvedComment,
    totalUsers,
    adminCount,
    userCount,
    totalView
    }
})
}

export const postService = {
    createPost,
    getAllPost,
    getPostById,
    getMyPosts,
    updateMyPost,
    deletePost,
    getStats
}