import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import otpRoutes from "./routes/otpRoutes.js";

dotenv.config();
const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/otp", otpRoutes);

// Connect DB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err));

// Create HTTP server
const server = http.createServer(app);

// Socket.IO server
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Track online users
let onlineUsers = new Map();

io.on("connection", (socket) => {
    console.log("⚡ New socket connected:", socket.id);

    // When user logs in & joins socket
    socket.on("addUser", (userId) => {
        onlineUsers.set(userId, socket.id);
        console.log("✅ User online:", userId);
        io.emit("getUsers", Array.from(onlineUsers.keys()));
    });

    // Send message event
    socket.on("sendMessage", ({ senderId, receiverId, text, image, _id }) => {
        const receiverSocketId = onlineUsers.get(receiverId);
        const messagePayload = { senderId, receiverId, text, image, _id, createdAt: new Date() };

        // Send to receiver if online
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("getMessage", messagePayload);
        }

        // Optionally emit back to sender for confirmation
        socket.emit("getMessage", messagePayload);
    });

    // Handle disconnect
    socket.on("disconnect", () => {
        for (let [key, value] of onlineUsers.entries()) {
            if (value === socket.id) {
                onlineUsers.delete(key);
                break;
            }
        }
        io.emit("getUsers", Array.from(onlineUsers.keys()));
        console.log("❌ Socket disconnected:", socket.id);
    });
});

// Attach io to app (so controllers can use it)
app.set("io", io);

server.listen(process.env.PORT || 5000, () =>
    console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
);
