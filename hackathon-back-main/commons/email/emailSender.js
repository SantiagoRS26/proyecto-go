require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE, // true para usar SSL/TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendEmailToOneDest = async (to, subject, text, html) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,
            text: text,
            html: html,
        };
        console.log(mailOptions);
        
        const info = await transporter.sendMail(mailOptions);
        console.log("Correo enviado: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("Error enviando el correo:", error);
        return false;
    }
};
exports.sendMultipleEmails = async (bccRecipients,subject, text,html) => {
    try {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: "",
          bcc: bccRecipients,
          subject: subject,
          text: text,
          html: html,
        };    
        const info = await transporter.sendMail(mailOptions);
        console.log("Correo enviado: %s", info.messageId);
        return true;
      } catch (error) {
        console.error("Error enviando el correo:", error);
        return false;
      }
}
