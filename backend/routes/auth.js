const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const nodemailer = require("nodemailer");

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// 🔹 SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      provider: "local"
    });

    await user.save();

    // ✨ Send email in background — don't await
    transporter.sendMail({
      from: `"Mannlytics 💜" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to Mannlytics 🎉",
      html: `
        <div style="font-family: Arial; background:#f5f7fa; padding:30px;">
          <div style="max-width:500px; margin:auto; background:white; padding:30px; border-radius:15px; box-shadow:0 10px 30px rgba(0,0,0,0.1); text-align:center;">
            <h1 style="color:#4f46e5;">Welcome to Mannlytics 💜</h1>
            <p style="color:#555; font-size:16px;">
              Hi <b>${name}</b>,<br><br>
              Your account has been successfully created 🎉
            </p>
            <p style="color:#777;">
              Start tracking your emotions and improve your mental health journey with AI.
            </p>
            <a href="http://localhost:5173/dashboard"
              style="display:inline-block; margin-top:20px; padding:12px 25px; background:#4f46e5; color:white; border-radius:8px; text-decoration:none;">
              Go to Dashboard
            </a>
            <p style="margin-top:30px; font-size:12px; color:#aaa;">
              Mannlytics • AI-Powered Emotional Intelligence
            </p>
          </div>
        </div>
      `
    }).catch(err => console.error("Email error:", err));

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Signup successful",
      user,
      token
    });

  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});

// 🔹 LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!user.password) {
      return res.status(400).json({
        message: "This account was created with Google. Please login with Google."
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      user,
      token
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});

// 🔹 GOOGLE LOGIN / SIGNUP
router.post("/google", async (req, res) => {
  try {
    const { name, email, photo, uid } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if user already exists
    let existingUser = await User.findOne({ email });

    // If user does not exist, create a new one
    if (!existingUser) {
      const newUser = new User({
        name,
        email,
        photo,
        googleId: uid,
        provider: "google",
        password: null
      });

      await newUser.save();

      // ✨ Send welcome email for Google signup
      transporter.sendMail({
        from: `"Mannlytics 💜" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Welcome to Mannlytics 🎉",
        html: `
          <div style="font-family: Arial; background:#f5f7fa; padding:30px;">
            <div style="max-width:500px; margin:auto; background:white; padding:30px; border-radius:15px; text-align:center;">
              <h1 style="color:#4f46e5;">Welcome to Mannlytics 💜</h1>
              <p style="color:#555;">Hi <b>${name}</b>, you have successfully signed up using Google.</p>
              <a href="http://localhost:5173/dashboard"
                style="display:inline-block; margin-top:20px; padding:12px 25px; background:#4f46e5; color:white; border-radius:8px; text-decoration:none;">
                Go to Dashboard
              </a>
              <p style="margin-top:30px; font-size:12px; color:#aaa;">
                Mannlytics • AI-Powered Emotional Intelligence
              </p>
            </div>
          </div>
        `
      }).catch(err => console.error("Email error:", err));

      existingUser = newUser; // Assign for token generation
    }

    // Generate token
    const token = jwt.sign(
      { id: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Google login successful",
      user: existingUser,
      token
    });

  } catch (error) {
    console.error("GOOGLE LOGIN ERROR:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});

module.exports = router;
