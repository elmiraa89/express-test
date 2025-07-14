// routes/posts.js
import express from "express";
import Post from "../models/posts.model.js";
import Comment from "../models/comments.model.js";

const router = express.Router();

// GET /posts - get all posts
router.get("/", async (req, res) => {
  try {
    // Populate comments field if you want to include the actual comments' detail
    const posts = await Post.find().populate('comments');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to get posts", error: err.message });
  }
});

// GET /posts/:id - get a specific post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("comments");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(400).json({ message: "Invalid ID", error: err.message });
  }
});

// POST /posts - create a new post
router.post("/", async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = new Post({ title, content });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ message: "Failed to create post", error: err.message });
  }
});

// PUT /posts - update a specific post (you can use req.body for the update)
router.put("/", async (req, res) => {
  try {
    const { id, title, content } = req.body;
    const post = await Post.findByIdAndUpdate(
      id,
      { title, content },
      { new: true }
    );
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(400).json({ message: "Failed to update post", error: err.message });
  }
});

// GET /posts/:id/comments - get comments of a specific post
router.get("/:id/comments", async (req, res) => {
  try {
    // Find comments where post _id matches
    const comments = await Comment.find({ post: req.params.id });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: "Failed to get comments", error: err.message });
  }
});

// DELETE /posts/:id - Deletes a specific post (and its comments)
router.delete("/:id", async (req, res) => {
  try {
    const postId = req.params.id;

    // First, find the post
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Also delete all associated comments
    await Comment.deleteMany({ post: postId });

    // Now delete the post itself
    await Post.findByIdAndDelete(postId);

    res.json({ message: "Post and associated comments deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete post", error: err.message });
  }
});

export default router;