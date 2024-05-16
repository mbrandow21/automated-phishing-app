// import { Resend } from "resend"

// const resend = new Resend(process.env.RESEND_API_KEY);
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export const sendtwoFactorTokenEmail = async (
  email: string,
  token: string,
) => {
  await sgMail.send({
    from: "verify@dauntlessit.com",
    to: email,
    subject: "2FA Code",
    html: `<p>Your 2FA code: ${token}</p>`
  })
}

export const sendPasswordResetEmail = async (
  email: string,
  token: string,
) => {
  const resetLink = `http://localhost:3000/auth/new-password?token=${token}`

  await sgMail.send({
    from: "verify@dauntlessit.com",
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`
  })
}

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;

  await sgMail.send({
    from: "verify@dauntlessit.com",
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`
  })
}
