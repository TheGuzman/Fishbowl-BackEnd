import nodemailer from 'nodemailer';
import {userEmail} from './mailAccount.js'
import {passEmail} from './mailAccount.js'

export const sendMail = (to, subject, content) => {
        const transporter = nodemailer.createTransport({
            service:'gmail',
            host: 'smtp.gmail.com ',
            port: 465,
            secure: true,
            auth: { 
                user: userEmail,
                pass: passEmail
            }
        });
        const message = {
            from: 'Fishbowl APP <no-reply-fishbowlappfordiscussions@gmail.com>',
            to, 
            subject, 
            html: content 
        };

        transporter.sendMail(message, (err, info) => {
            if (err) {
                console.log('Error occurred. ' + err.message);
                return
            }
            console.log('Message sent: %s', info.messageId);
             console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });
}