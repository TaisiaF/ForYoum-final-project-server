import Reply from "../MongoDB/Models/Reply.js";
import Discussion from "../MongoDB/Models/Discussion.js";

const createReply = async (req, res) => {

    const { discussionId, parentId, content } = req.body;

    const discussion = await Discussion.findById(discussionId);

    if (!discussion) {
        return res.status(404).json({
            message: "Discussion not found"
        });
    }

    // יצירת תגובה
    const reply = await Reply.create({
        discussionId,
        parentId: parentId || null,
        content,
        authorId: req.user.id
    });

    discussion.replyCount += 1;
    await discussion.save();

    res.status(201).json(reply);
};



const getRepliesByDiscussion = async (req, res) => {

    const replies = await Reply.find({
        discussionId: req.params.id
    }).sort({ createdAt: 1 });

    // מסדר תגובות לפי נמען
    const replyMap = {};
    const rootReplies = [];

    replies.forEach(reply => {
        reply = reply.toObject();
        reply.children = [];
        replyMap[reply._id] = reply;
    });

    replies.forEach(reply => {

        const current = replyMap[reply._id];

        if (reply.parentId) {
            const parent = replyMap[reply.parentId];

            if (parent) {
                parent.children.push(current);
            }
        } else {
            rootReplies.push(current);
        }
    });

    res.json(rootReplies);
};



const updateReply = async (req, res) => {

    const reply = await Reply.findById(req.params.id);

    if (!reply) {
        return res.status(404).json({
            message: "Reply not found"
        });
    }

    const isOwner =
        reply.authorId.toString() === req.user.id;

    const isAdmin =
        req.user.role === "admin";

    if (!isOwner && !isAdmin) {
        return res.status(403).json({
            message: "Not authorized"
        });
    }

    reply.content = req.body.content || reply.content;

    await reply.save();

    res.json(reply);
};



const deleteReplyRecursive = async (replyId) => {

    const children = await Reply.find({
        parentId: replyId
    });

    for (const child of children) {
        await deleteReplyRecursive(child._id);
    }

    await Reply.findByIdAndDelete(replyId);
};

const deleteReply = async (req, res) => {

    const reply = await Reply.findById(req.params.id);

    if (!reply) {
        return res.status(404).json({
            message: "Reply not found"
        });
    }

    const isOwner =
        reply.authorId.toString() === req.user.id;

    const isAdmin =
        req.user.role === "admin";

    if (!isOwner && !isAdmin) {
        return res.status(403).json({
            message: "Not authorized"
        });
    }

    await deleteReplyRecursive(reply._id);

    // מעדכנים שדה של כמות תגובות
    await Discussion.findByIdAndUpdate(
        reply.discussionId,
        { $inc: { replyCount: -1 } }
    );

    res.json({
        message: "Reply deleted"
    });
};



const likeReply = async (req, res) => {

    const reply = await Reply.findById(req.params.id);

    if (!reply) {
        return res.status(404).json({
            message: "Reply not found"
        });
    }

    await Reply.updateOne(
        { _id: req.params.id },
        { $addToSet: { likedBy: req.user.id } }
    );

    res.json({
        message: "Liked reply"
    });
};



const unlikeReply = async (req, res) => {

    await Reply.updateOne(
        { _id: req.params.id },
        { $pull: { likedBy: req.user.id } }
    );

    res.json({
        message: "Unliked reply"
    });
};



export default {
    createReply,
    getRepliesByDiscussion,
    updateReply,
    deleteReply,
    likeReply,
    unlikeReply
};
