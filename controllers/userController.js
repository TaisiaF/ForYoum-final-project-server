import User from "../MongoDB/Models/User.js";
import bcrypt from "bcrypt";
import Discussion from "../MongoDB/Models/Discussion.js";
import Reply from "../MongoDB/Models/Reply.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

const getMe = async (req, res) => {

    const user = await User.findById(req.user.id).select("-passwordHash");

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    res.json(user);
};


const getUserById = async (req, res) => {
    const user = await User.findById(req.params.id)
        .select("-email -passwordHash");

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    const isOwner =
        req.user?.id === user._id.toString();

    if (user.isPrivate && !isOwner) {
        return res.status(403).json({
            message: "This profile is private"
        });
    }

    res.json(user);
};


const getUserDiscussions = async (req, res) => {

const discussions = await Discussion.find({
    authorId: req.params.id
})
.populate("authorId", "username role")
.sort({ createdAt: -1 });

    res.json(discussions);
};


const getMyReplies = async (req, res) => {

    const replies = await Reply.find({
        authorId: req.user.id
    }).sort({ createdAt: -1 });

    res.json(replies);
};


const getMyBookmarks = async (req, res) => {
    const user = await User.findById(req.user.id)
        .select("bookmarkedDiscussions")
        .populate({
            path: "bookmarkedDiscussions",
            populate: {
                path: "authorId",
                select: "username role profilePicture"
            }
        });

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    res.json(user.bookmarkedDiscussions);
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


const updateProfilePrivacy = async (req, res) => {
    const { isPrivate } = req.body;

    if (typeof isPrivate !== "boolean") {
        return res.status(400).json({
            message: "isPrivate must be a boolean"
        });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    user.isPrivate = isPrivate;
    await user.save();

    res.json({
        message: "Profile privacy updated successfully",
        isPrivate: user.isPrivate
    });
};


const banUser = async (req, res) => {

    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "Admin only"
        });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    if (user.role === "admin") {
        return res.status(403).json({
            message: "Cannot ban an admin"
        });
    }

    user.banned = true;

    await user.save();

    res.json({
        message: "User banned"
    });
};


const unbanUser = async (req, res) => {

    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "Admin only"
        });
    }

    const user = await User.findById(
        req.params.id
    );

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    user.banned = false;

    await user.save();

    res.json({
        message: "User unbanned"
    });
};


const deleteUserById = async (req, res) => {

    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "Admin only"
        });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    await user.deleteOne();

    res.json({
        message: "User deleted"
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


const updateProfilePicture = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            message: "Profile picture is required"
        });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    const result = await uploadToCloudinary(
        req.file.buffer
    );

    user.profilePicture = result.secure_url;

    await user.save();

    res.json({
        message: "Profile picture updated successfully",
        profilePicture: user.profilePicture
    });
};





export default {
    getMe,
    updateUsername,
    updateEmail,
    updatePassword,
    updateProfilePrivacy,
    banUser,
    unbanUser,
    deleteUserById,
    deleteMe,
    getUserById,
    getUserDiscussions,
    getMyReplies,
    updateProfilePicture,
    getMyBookmarks
};


