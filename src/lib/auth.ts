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
      sendOnSignUp:true,
      autoSignInAfterVerification:true,
    sendVerificationEmail: async ( { user, url, token }, request) => {
      try {
            const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`
            const info = await transporter.sendMail({           
            from: '"prisma blog" <mustakahmmed88@gmail.com>',
            to: user.email,
            subject: "Hello ✔",
            text: "Hello world?", // Plain-text version of the message
            html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Verify your email</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background:#111827; padding:20px; text-align:center;">
              <h1 style="color:#ffffff; margin:0;">Prisma Blog</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:30px; color:#333;">
              <p style="font-size:16px;">Hey <strong>${user.name ?? "there"}</strong>,</p>

              <p style="font-size:15px; line-height:1.6;">
                Thanks for signing up 🎉  
                Please confirm your email address by clicking the button below.
              </p>

              <div style="text-align:center; margin:30px 0;">
                <a href="${verificationUrl}"
                   style="
                     background:#2563eb;
                     color:#ffffff;
                     padding:14px 28px;
                     text-decoration:none;
                     border-radius:6px;
                     font-size:16px;
                     display:inline-block;
                   ">
                  Verify Email
                </a>
              </div>

              <p style="font-size:14px; color:#555;">
                If you didn’t create this account, you can safely ignore this email.
              </p>

              <p style="font-size:14px; color:#555;">
                This link will expire soon, so don’t sleep on it 😄
              </p>

              <p style="margin-top:30px;">
                — Team Prisma Blog
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f3f4f6; padding:15px; text-align:center; font-size:12px; color:#777;">
              © ${new Date().getFullYear()} Prisma Blog. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`, // HTML version of the message
  });

  console.log("Message sent:", info.messageId);
      } catch (error) {
        console.error(error)
        throw error
      }

    },
  }, 
});