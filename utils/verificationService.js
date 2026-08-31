import sendEmail from "./sendEmail.js";
import User from "../MongoDB/Models/User.js";


const generateVerificationCode = () => {

    return Math.floor(
        100000 +
        Math.random() * 900000
    ).toString();
};



const sendVerificationCode = async (user, subject) => {

    console.log("sendVerificationCode called");

    const code = generateVerificationCode();

    console.log("generated code:", code);

    user.verificationCode = code;

    user.verificationCodeExpires =
        new Date(
            Date.now() + 10 * 60 * 1000  //קוד אימות תקף ל10 דקות
        );

    await user.save();

    await sendEmail(
        user.email,
        subject,
        `Your code is ${code}`
    );
};



const verifyCode = async (email, code) => {
    const user = await User.findOne({
        email: email.toLowerCase()
    });

    if (!user) {
        throw new Error("User not found");
    }

    if (!user.verificationCode || user.verificationCode !== code) {
        throw new Error("Invalid code");
    }

    if (!user.verificationCodeExpires || user.verificationCodeExpires < new Date()) {
        throw new Error("Code expired");
    }

    user.verificationCode = null;
    user.verificationCodeExpires = null;

    await user.save();

    return user;
};




export {
    sendVerificationCode,
    verifyCode
};