const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  user: process.env.user,
  pass: process.env.pass,
});
async function mail(toMail: String, token: any) {
  try {
    await transport.sendMail({
      from: process.env.user,
      to: toMail,
      subject: "Password Reset Request",
      html: `
      <p>Hello,</p>
      <p>You recently requested to reset your password for your account. Click the link below to reset it:</p>
      <p><a href="${process.env.frontend}/changePassword?token=${token}">Reset your password</a></p>
      <p>If you did not request a password reset, please ignore this email or reply to let us know. This link will expire in 1 hour.</p>
      <p>Thanks,</p>
      <p>Your Company Name</p>
    `,
    });
  } catch (err) {
    throw err;
  }
}
module.exports = mail;
