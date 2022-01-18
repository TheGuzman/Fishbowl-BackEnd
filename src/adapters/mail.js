import nodemailer from 'nodemailer';
// import { google } from 'googleapis'
import dotenv from 'dotenv';
dotenv.config();


// const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID,process.env.CLIENT_SECRET, process.env.REDIRECT_URI)

// oAuth2Client.setCredentials({refresh_token: process.env.REFRESH_TOKEN})

export const sendMail = (to, subject, content) => {

        // const accessToken = await oAuth2Client.getAccessToken()

        const transporter = nodemailer.createTransport({
            service:'gmail',
            host: 'smtp.gmail.com ',
            port: 465,
            secure: true,
            auth: {
                // type:'OAuth2',
                user:process.env.USER_EMAIL,
                // clientId: process.env.CLIENT_ID,
                // clientSecret: process.env.CLIENT_SECRET,
                // refresh_token: process.env.REFRESH_TOKEN,
                // accessToken: accessToken,
                pass:process.env.USER_PASS,
            },
            from: process.env.USER_EMAIL
        });
        const message = {
            from: process.env.USER_EMAIL,
            // 'Fishbowl APP <no-reply-fishbowlappfordiscussions@gmail.com>',
            to, 
            subject, 
            html: content,
            text: content 
        };

        transporter.sendMail(message, (err, info) => {
            if (err) {
                console.log('Error occurred. ' + err.message);
                return
            }
            console.log('Message sent: %s', info.messageId);
             console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });
        console.log(process.env.USER_EMAIL)
}