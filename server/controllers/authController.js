import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import express from "express";



// Register
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, profilePic } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            profilePic
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profilePic: user.profilePic,
            token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" })
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profilePic: user.profilePic,
            token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" })
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
