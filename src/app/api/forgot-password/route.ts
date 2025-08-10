import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust path to your Prisma client
import nodemailer from "nodemailer";
import crypto from "crypto";

// Configure Nodemailer transport (update with your email provider settings)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // e.g., "smtp.gmail.com"
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: process.env.EMAIL_SECURE === "true", // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER, // e.g., your Gmail address
    pass: process.env.EMAIL_PASS, // e.g., Gmail app password
  },
});

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if email doesn't exist for security
      return NextResponse.json({ message: "If the email exists, a reset link will be sent." }, { status: 200 });
    }

    // Generate a unique token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry

    // Store the token
    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    // Send reset email
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `
        <p>Hello ${user.firstName || "User"},</p>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>Your App Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "If the email exists, a reset link will be sent." }, { status: 200 });
  } catch (error) {
    console.error("Error in forgot-password API:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
