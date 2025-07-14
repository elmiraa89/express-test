import express from "express";
import Comment from "../models/comments.model.js";
import Post from "../models/posts.model.js";

const router = express.Router();

// CREATE a comment 
router.post("/", async (req, res) => {
  try {
    const { content, post } = req.body;
    // 1. Create and save the comment
    const comment = await Comment.create({ content, post });
    // 2. Add the comment ID reference to the post's comments array
    await Post.findByIdAndUpdate(post, { $push: { comments: comment._id } });
    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ message: "Failed to add comment", error: err.message });
  }
});

// UPDATE a comment 
router.put("/:id", async (req, res) => {
  try {
    const { content } = req.body;
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { content },
      { new: true }
    );
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    res.json(comment);
  } catch (err) {
    res.status(400).json({ message: "Failed to update comment", error: err.message });
  }
});

// DELETE a comment 
router.delete("/:id", async (req, res) => {
  try {
    // 1. Remove from Post's comments array
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    await Post.findByIdAndUpdate(comment.post, { $pull: { comments: comment._id } });

    // 2. Delete the comment itself
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(400).json({ message: "Failed to delete comment", error: err.message });
  }
});

export default router;