import express from "express";
import userController from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import asyncHandler from "../middleware/asyncHandler.js";
import upload from "../middleware/upload.js";
import optionalAuthMiddleware from "../middleware/optionalAuthMiddleware.js";
import { updatePasswordValidation } from "../middleware/userValidators.js";

const router = express.Router();

router.get("/me", authMiddleware, asyncHandler(userController.getMe));

router.get("/:id", optionalAuthMiddleware, asyncHandler(userController.getUserById));

router.get("/:id/discussions", asyncHandler(userController.getUserDiscussions));

router.get("/me/replies", authMiddleware, asyncHandler(userController.getMyReplies));

router.get("/me/bookmarks", authMiddleware, asyncHandler(userController.getMyBookmarks));

router.patch("/me/username", authMiddleware, asyncHandler(userController.updateUsername));

router.patch("/me/email", authMiddleware, asyncHandler(userController.updateEmail));

router.patch("/me/password", authMiddleware, updatePasswordValidation, asyncHandler(userController.updatePassword));

router.patch("/me/profile-picture", authMiddleware, upload.single("profilePicture"), asyncHandler(userController.updateProfilePicture));

router.patch("/me/privacy", authMiddleware, asyncHandler(userController.updateProfilePrivacy));

router.patch("/:id/ban", authMiddleware, asyncHandler(userController.banUser));

router.patch("/:id/unban", authMiddleware, asyncHandler(userController.unbanUser));

router.delete("/me", authMiddleware, asyncHandler(userController.deleteMe));

router.delete("/:id", authMiddleware, asyncHandler(userController.deleteUserById));


export default router;
