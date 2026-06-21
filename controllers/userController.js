import User from "../MongoDB/Models/User.js";
import bcrypt from "bcrypt";
import Discussion from "../MongoDB/Models/Discussion.js";
import Reply from "../MongoDB/Models/Reply.js";

const getMe = async (req, res) => {

    const user = await User.findById(req.user.id)
        .select("-passwordHash");

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    res.json(user);
};


const updateUsername = async (req, res) => {

    const { username } = req.body;

    const existing = await User.findOne({ username });

    if (existing) {
        return res.status(409).json({
            message: "Username already taken"
        });
    }

    const user = await User.findById(req.user.id);

    user.username = username;

    await user.save();

    res.json({
        message: "Username updated successfully"
    });
};


const updateEmail = async (req, res) => {

    const { email, password } = req.body;

    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(
        password,
        user.passwordHash
    );

    if (!isMatch) {
        return res.status(401).json({
            message: "Incorrect password"
        });
    }

    const existing = await User.findOne({ email });

    if (existing) {
        return res.status(409).json({
            message: "Email already in use"
        });
    }

    user.email = email.toLowerCase();

    await user.save();

    res.json({
        message: "Email updated"
    });
};


const updatePassword = async (req, res) => {

    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(
        oldPassword,
        user.passwordHash
    );

    if (!isMatch) {
        return res.status(401).json({
            message: "Old password is incorrect"
        });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    user.passwordHash = hashed;

    await user.save();

    res.json({
        message: "Password updated successfully"
    });
};


const deleteMe = async (req, res) => {

    const user = await User.findById(req.user.id);

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    await user.deleteOne();

    res.json({
        message: "Account deleted successfully"
    });
};



const getUserById = async (req, res) => {

    const user = await User.findById(req.params.id)
        .select("-email -passwordHash");

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    res.json(user);
};


const getUserDiscussions = async (req, res) => {

    const discussions = await Discussion.find({
        authorId: req.params.id
    }).sort({ createdAt: -1 });

    res.json(discussions);
};



const getMyReplies = async (req, res) => {

    const replies = await Reply.find({
        authorId: req.user.id
    }).sort({ createdAt: -1 });

    res.json(replies);
};


export default {
    getMe,
    updateUsername,
    updateEmail,
    updatePassword,
    deleteMe,
    getUserById,
    getUserDiscussions,
    getMyReplies
};


