import express from "express";
import discussionController from "../controllers/discussionController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();

router.get("/", asyncHandler(discussionController.getDiscussions));

router.get("/:id", asyncHandler(discussionController.getDiscussionById));

router.post("/", authMiddleware, asyncHandler(discussionController.createDiscussion));

router.patch("/:id", authMiddleware, asyncHandler(discussionController.updateDiscussion));

router.delete("/:id", authMiddleware, asyncHandler(discussionController.deleteDiscussion));

router.post("/:id/like", authMiddleware, asyncHandler(discussionController.likeDiscussion));

router.delete("/:id/like", authMiddleware, asyncHandler(discussionController.unlikeDiscussion));

export default router;
