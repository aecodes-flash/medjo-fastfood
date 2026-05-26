import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ─── REGISTER ───────────────────────────────────────
export const register = async (req, res) => {
  try {
    // 1. Get the data the user typed in the form
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8  characters." });
    }


    // 2. Check if email is already used
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 3. Hash the password before saving
    // 10 = how many times it scrambles (higher = safer but slower)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create the new user in MongoDB
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword, // save hashed, never plain text
    });

    // 5. Create a JWT token for the new user
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },           // payload — what's inside the token
      process.env.JWT_SECRET,         // secret key from .env
      { expiresIn: "7d" }             // token expires in 7 days
    );

    // 6. Send back the token and user info
    res.status(201).json({
      message: "Account created successfully.",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      }
    });

  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── LOGIN ───────────────────────────────────────────
export const login = async (req, res) => {
  try {
    // 1. Get email and password from the form
    const { email, password } = req.body;

    // 2. Find the user in MongoDB by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 3. Compare typed password with the hashed one in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 4. Create a JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 5. Send back the token and user info
    res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};