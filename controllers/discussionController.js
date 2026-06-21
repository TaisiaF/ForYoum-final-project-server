import Discussion from "../MongoDB/Models/Discussion.js";
import Reply from "../MongoDB/Models/Reply.js";
import getPagination from "../utils/pagination.js";

const createDiscussion = async (req, res) => {

    const { title, content, category } = req.body;

    const discussion = await Discussion.create({
        title,
        content,
        category,
        authorId: req.user.id
    });

    res.status(201).json(discussion);
};



const getDiscussions = async (req, res) => {

    const {
        page = 1,
        limit = 10,
        category,
        search,
        after,
        before,
        sort = "newest"
    } = req.query;

    const { skip } = getPagination(page, limit);

    const filter = {};

    // פילטור לפי קטגוריה
    if (category) {
        filter.category = category;
    }

    // פילטור לפי תאריך
    if (after || before) {
        filter.createdAt = {};
        if (after) filter.createdAt.$gte = new Date(after);
        if (before) filter.createdAt.$lte = new Date(before);
    }

    // פילטור לפי מילות מפתח
    if (search) {
        filter.$text = { $search: search };
    }

    // סוגי מיון
    let sortOption = {};

    if (sort === "newest") {
        sortOption = { createdAt: -1 };
    }

    if (sort === "oldest") {
        sortOption = { createdAt: 1 };
    }

    if (sort === "likes") {
        sortOption = { "likedByCount": -1 };
    }

    //  איגוד שדות נחוצים להצגה (בתוך משתנה)
    const discussions = await Discussion.aggregate([
        { $match: filter },
        {
            $addFields: {
                likedByCount: { $size: "$likedBy" }
            }
        },
        { $sort: sortOption },
        { $skip: skip },
        { $limit: Number(limit) }
    ]);

    const total = await Discussion.countDocuments(filter);

    res.json({
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),  //מעגל תוצאת חילוק כלפי מעלה
        totalItems: total,
        data: discussions
    });
};




const getDiscussionById = async (req, res) => {

    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
        return res.status(404).json({
            message: "Discussion not found"
        });
    }

    res.json(discussion);
};



const updateDiscussion = async (req, res) => {

    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
        return res.status(404).json({
            message: "Discussion not found"
        });
    }

    const isOwner = discussion.authorId.toString() === req.user.id;

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
        return res.status(403).json({
            message: "Not authorized"
        });
    }

    const { title, content, category } = req.body;

    if (title) discussion.title = title;
    if (content) discussion.content = content;
    if (category) discussion.category = category;

    await discussion.save();
    res.json(discussion);
};




const deleteDiscussion = async (req, res) => {

    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
        return res.status(404).json({
            message: "Discussion not found"
        });
    }

    const isOwner = discussion.authorId.toString() === req.user.id;

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
        return res.status(403).json({
            message: "Not authorized"
        });
    }

    // מוחקים גם את התגובות לשיחה
    await Reply.deleteMany({
        discussionId: discussion._id
    });

    await discussion.deleteOne();

    res.json({
        message: "Discussion deleted successfully"
    });
};



const likeDiscussion = async (req, res) => {

    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
        return res.status(404).json({
            message: "Discussion not found"
        });
    }

    //עדכון שדה של לייקים
    await Discussion.updateOne(
        { _id: req.params.id },
        { $addToSet: { likedBy: req.user.id } }
    );

    res.json({
        message: "Liked"
    });
};



const unlikeDiscussion = async (req, res) => {

    await Discussion.updateOne(
        { _id: req.params.id },
        { $pull: { likedBy: req.user.id } }
    );

    res.json({
        message: "Unliked"
    });
};



export default {
    createDiscussion,
    getDiscussions,
    getDiscussionById,
    updateDiscussion,
    deleteDiscussion,
    likeDiscussion,
    unlikeDiscussion
};
