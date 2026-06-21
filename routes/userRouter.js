import express from "express";
import userController from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();

router.get("/me", authMiddleware, asyncHandler(userController.getMe));

router.patch("/me/username", authMiddleware, asyncHandler(userController.updateUsername));

router.patch("/me/email", authMiddleware, asyncHandler(userController.updateEmail));

router.patch("/me/password", authMiddleware, asyncHandler(userController.updatePassword));

router.delete("/me", authMiddleware, asyncHandler(userController.deleteMe));

router.get("/:id", asyncHandler(userController.getUserById));

router.get("/:id/discussions", asyncHandler(userController.getUserDiscussions));

router.get("/me/replies", authMiddleware, asyncHandler(userController.getMyReplies));

export default router;
