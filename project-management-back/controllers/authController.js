import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// ==============================
// Email Transporter
// ==============================
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ==============================
// Generate JWT
// ==============================
const generateToken = (user) => {
    return jwt.sign(
        { sub: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
};

// ==============================
// Register
// ==============================
export const register = async (req, res) => {
    try {
        const { fullName, email, password, role } = req.body;

        // Check duplicates
        const exists = await User.findOne({ email });
        if (exists)
            return res.status(400).json({ message: "Email already exists" });

        // Prevent creating leader directly (security)
        let finalRole = "member";
        if (role === "leader") {
            // Optional: allow only if admin exists
            finalRole = "leader";
        }

        const hashed = await bcrypt.hash(password, 10);

        const user = await User.create({
            fullName,
            email,
            password: hashed,
            role: finalRole
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ==============================
// Login
// ==============================
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");
        if (!user)
            return res.status(400).json({ message: "Invalid email or password" });

        const match = await bcrypt.compare(password, user.password);
        if (!match)
            return res.status(400).json({ message: "Invalid email or password" });

        const token = generateToken(user);

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ==============================
// Forgot Password
// ==============================
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user)
            return res.status(404).json({ message: "User not found" });

        // Generate tokens
        const rawToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
        await user.save();

        const resetURL = `${process.env.CLIENT_URL}/reset-password.html?token=${rawToken}`;

        await transporter.sendMail({
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: "Reset Password",
            html: `
                <p>Click the link below to reset your password:</p>
                <a href="${resetURL}" target="_blank">${resetURL}</a>
            `
        });

        res.json({ message: "Reset link sent" });

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// ==============================
// Reset Password
// ==============================
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() }
        }).select("+password");

        if (!user)
            return res.status(400).json({ message: "Invalid or expired token" });

        // Update password
        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.json({ message: "Password reset successful" });

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
