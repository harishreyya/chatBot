import nodemailer, { Transporter } from "nodemailer"

interface MailOptions {
  from?: string
  to: string
  subject: string
  text: string
  html: string
}

export const emailConfig = {
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
}

const transporter: Transporter = nodemailer.createTransport(emailConfig)

export const sendMail = async ({ from, to, subject, text, html }: MailOptions): Promise<void> => {
  const mailData = {
    from: from ?? process.env.EMAIL_FROM,
    to,
    subject,
    text,
    html,
  }

  console.log("📧 Sending email:", mailData)
  if (process.env.NODE_ENV === 'production') await transporter.sendMail(mailData)
}

export default transporter
