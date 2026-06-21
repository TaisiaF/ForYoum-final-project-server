import express from "express";
import replyController from "../controllers/replyController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();

router.post("/", authMiddleware, asyncHandler(replyController.createReply));

router.get("/discussion/:id", asyncHandler(replyController.getRepliesByDiscussion));

router.patch("/:id", authMiddleware, asyncHandler(replyController.updateReply));

router.delete("/:id", authMiddleware, asyncHandler(replyController.deleteReply));

router.post("/:id/like", authMiddleware, asyncHandler(replyController.likeReply));

router.delete("/:id/like", authMiddleware, asyncHandler(replyController.unlikeReply));

export default router;
