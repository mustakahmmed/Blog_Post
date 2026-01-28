import { betterAuth, string } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.AUTH_USER,
    pass: process.env.AUTH_PASSWORD,
  },
});



export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    trustedOrigins:[process.env.APP_URL!],
    user:{
        additionalFields:{
            role:{
                type:"string",
                defaultValue:"USER",
                required:false
            },
            mobile:{
                type:"string",
                required:false
            },
            status:{
                type:"string",
                defaultValue:"ACTIVE",
                required:false
            }
        }
    },
    emailAndPassword: { 
    enabled: true,
    autoSignIn:false,
    requireEmailVerification: true
  },
    emailVerification: {
    sendVerificationEmail: async ( { user, url, token }, request) => {
            const info = await transporter.sendMail({           
            from: '"prisma blog" <mustakahmmed88@gmail.com>',
            to: "alihasanali8954@gmail.com",
            subject: "Hello ✔",
            text: "Hello world?", // Plain-text version of the message
            html: "<b>Hello world?</b>", // HTML version of the message
  });

  console.log("Message sent:", info.messageId);
    },
  }, 
});