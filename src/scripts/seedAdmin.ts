
import { prisma } from "../lib/prisma";
import { userRole } from "../middlewere/auth";

async function seedAdmin() {
    try {
        const adminData ={
        name:"admin",
        email:"admin@gmail.com",
        role:userRole.ADMIN,
        mobile:"0167889",
        password: "admin1234",
        emailVerified:true
    }
    
    const checkUser = await prisma.user.findUnique({
        where:{
            email:adminData.email
        }
    })
    // if user alrady exist then throw error
    if (checkUser) {
        throw new Error("this acount alrady exist in db")
    }
    // now sign up admin
    const signUpAdmin = await fetch('http://localhost:3000/api/auth/sign-up/email',{
        method:'POST',
        headers:{
            "Content-Type": "application/json",
            "origin":"http://localhost:3000"
        },
        body:JSON.stringify(adminData)
    })

    if (signUpAdmin.ok) {
        await prisma.user.update({
            where:{
                email:adminData.email
            },
            data:{
                emailVerified:true
            }
        })
    }

    console.log(signUpAdmin);
    
    } catch (error) {
        console.error(error);
        
    }
}
seedAdmin()