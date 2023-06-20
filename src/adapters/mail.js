import nodemailer from "nodemailer";

const MAIL_USER = process.env.USER_EMAIL;

export const sendMail = (to, subject, content) => {
  nodemailer.createTestAccount((err, account) => {
    if (err) {
      console.error("Failed to create a testing account. " + err.message);
    }
    console.log(account, "account");

    const transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
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
  });
};
