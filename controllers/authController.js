import bcrypt from "bcrypt";
import User from "../MongoDB/Models/User.js";
import generateToken from "../utils/generateToken.js";
import { sendVerificationCode, verifyCode} from "../utils/verificationService.js";



const register = async (req, res) => {

const {
    username,
    email,
    password,
    role = "user"
} = req.body;

    const existingUsername = await User.findOne({
        username
    });

    if (existingUsername) {
        return res.status(409).json({
            message: "Username already exists"
        });
    }

    const existingEmail = await User.findOne({
        email: email.toLowerCase()
    });

    if (existingEmail) {
        return res.status(409).json({
            message: "Email already exists"
        });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        email: email.toLowerCase(),
        passwordHash,
        role
    });


    await sendVerificationCode( user, "Forum Verification Code");

    return res.status(201).json({
    message: "Verification code sent",
    email: user.email
});

};




const login = async (req, res) => {

    const {
        username,
        password
    } = req.body;

    const user =
        await User.findOne({
            username
        });

    if (!user) {
        return res.status(401).json({
            message: "Invalid credentials"
        });
    }

    const isMatch =
        await bcrypt.compare(
            password,
            user.passwordHash
        );

    if (!isMatch) {
        return res.status(401).json({
            message: "Invalid credentials"
        });
    }

    if (!user.verified) {
        return res.status(403).json({
            message:
                "Email not verified"
        });
    }

    await sendVerificationCode( user, "Login Verification Code");

    return res.status(200).json({
        message: "Verification code sent",
        email: user.email
    });
};



const verifyRegistration = async (req, res) => {
    const { email, code } = req.body;

    const user = await verifyCode( email, code);

    user.verified = true;

    await user.save();

    res.status(200).json({
        message: "Account verified"
    });
};



const verifyLogin = async (req, res) => {
    const { email, code } = req.body;

    const user = await verifyCode( email, code);

    const token = generateToken(user);

    res.status(200).json({
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    });
};

export default {
    register,
    login,
    verifyRegistration,
    verifyLogin
};
