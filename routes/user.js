import { Router } from "express";
import bcrypt from "bcrypt";
import User from "../models/users.model.js";
import passport from "../config/passport.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import upload from "../modules/upload.module.js";

const router = Router();

router.post("/signup", upload.single('profileImageUrl'), async (req, res) => {
  const { email, username, password } = req.body; // const hashedPassword = await bcrypt.hash(password, 10)
  const profileImageUrl = req.file ? req.file.location : undefind // Get the uploaded file's location from S3
  const user = await User.create({ 
    username, 
    email, 
    password, 
    profileImageUrl
  });
  res.status(201).json(user);
});

router.post(
  "/login",
  passport.authenticate("local", { failureMessage: true, session: false }),
  (req, res) => {
    let token = null;
    if (req.user) {
      const _id = req.user._id;
      const username = req.user.username; // Get username from req.user
      const payload = { _id };
      token = jwt.sign(payload, process.env.JWT_SECRET_KEY);
      res.cookie("token", token);
      res.json({ message: "login success!", username: username }); // Include username in response
    } else {
      res.status(401).json({ message: "Authentication failed." });
    }
  }
);

router.post("/logout", (req, res) => {
  req.logout(() => {
    req.session.destroy(() => {
      res.clearCookie("connect.sid"); // Clear session cookie if used
      res.clearCookie("token"); // Clear JWT token cookie
      res.json({ message: "logout!" });
    });
  });
});

// New endpoint to get currently authenticated user's details
router.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // req.user, contains the user object from the JWT strategy
    if (req.user) {
      res.json({
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        // Add any other profile fields you want to expose
      });
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  }
);

const transpoter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "dongwon1103@gmail.com",
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

router.post("/send-email", async (req, res) => {
  const { to, subject, text } = req.body;
  try {
    await transpoter.sendMail({
      from: "dongwon1103@gmail.com",
      to,
      subject,
      text,
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get(
  "/login/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/login/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    let token = null;
    if (req.user) {
      const _id = req.user._id;
      const payload = { _id };
      token = jwt.sign(payload, process.env.JWT_SECRET_KEY);
    }
    res.cookie("token", token);
    res.json({ message: "login success!" }); // Consider including username here too for consistency
  }
);

export default router;
