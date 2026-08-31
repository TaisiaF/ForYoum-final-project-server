import nodemailer from "nodemailer";

const transporter =
    nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

const sendEmail = async ( to, subject, text) => {

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER.trim(),
            pass: process.env.EMAIL_PASS.trim()
        }
    });

    await transporter.verify();


    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
    });

};

export default sendEmail;