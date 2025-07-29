import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(req: NextRequest) {
  const { firstName, lastName, email, phone, message } = await req.json()

  if (!firstName || !email || !phone) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // or 'hotmail' / 'sendgrid' etc.
      auth: {
        user: process.env.CONTACT_EMAIL,
        pass: process.env.CONTACT_EMAIL_PASS,
      },
    })

    await transporter.sendMail({
      from: `"${firstName} ${lastName}" <${email}>`,
      to: process.env.CONTACT_EMAIL_TO, // recipient email
      subject: "New Contact Form Submission",
      text: `
New Contact Submission:
Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone}
Message:
${message}
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Email error:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
