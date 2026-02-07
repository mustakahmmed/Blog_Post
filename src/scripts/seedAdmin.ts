import { prisma } from "../lib/prisma"
import { userRole } from "../middlewere/auth"

async function seedAdmin(){
    try {
        const adminData = {
            name: "Admin2 Saheb",
            email: "admin2@admin.com",
            role: userRole.ADMIN,
            password: "admin1234"
        }

        const existingUser = await prisma.user.findUnique({
            where:{
                email:adminData.email
            }
        });

        if (existingUser) {
            throw new Error("user alrady exist")
        }

        const signupAdmin = await fetch('http://localhost:3000/api/auth/sign-up/email',{
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body:JSON.stringify(adminData)
        })
        console.log(signupAdmin);
        
    } catch (error) {
        console.error(error)
    }
}

seedAdmin()