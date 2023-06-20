import nodemailer from "nodemailer";
// import { google } from 'googleapis'
// import dotenv from 'dotenv';
// dotenv.config();

const MAIL_USER = process.env.USER_EMAIL;
const MAIL_PASS = process.env.USER_PASS;

// const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID,process.env.CLIENT_SECRET, process.env.REDIRECT_URI)

// oAuth2Client.setCredentials({refresh_token: process.env.REFRESH_TOKEN})

export const sendMail = (to, subject, content) => {
  // const accessToken = await oAuth2Client.getAccessToken()

  const transporter = nodemailer.createTransport({
    host: account.smtp.host,
    port: account.smtp.port,
    secure: account.smtp.secure,
    auth: {
      // usuario y pass (ej: xxx@gmail.com)
      user: account.user,
      pass: account.pass,
    },
  });
  const message = {
    from: `FISHBOWL APP <${MAIL_USER}>`,
    // 'Fishbowl APP <no-reply-fishbowlappfordiscussions@gmail.com>',
    to,
    subject,
    html: content,
    text: content,
  };

  transporter.sendMail(message, (err, info) => {
    if (err) {
      console.log("Error occurred. " + err.message);
      return;
    }
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  });
};
