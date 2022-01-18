import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const sendMail = (to, subject, content) => {
        const transporter = nodemailer.createTransport({
            // service:'gmail',
            host: 'smtp.gmail.com ',
            port: 465,
            secure: true,
            auth: {
                
                user:process.env.USER_EMAIL,
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