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

// ---------------------------
// ✅ Allowed origins
// ---------------------------
const allowedOrigins = [
  "http://localhost:5173",               // local dev
  "https://talkative-ten.vercel.app",    // production
];

// Function-based CORS config
const corsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // allow server-to-server/curl

    const isAllowed =
      allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin);

    if (isAllowed) cb(null, true);
    else {
      console.log("❌ Blocked by CORS:", origin);
      cb(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// ---------------------------
// ✅ API routes
// ---------------------------
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/otp", otpRoutes);

// Health check (for Render/monitoring)
app.get("/health", (_, res) => res.send("ok"));

// ---------------------------
// ✅ MongoDB connection
// ---------------------------
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ---------------------------
// ✅ HTTP + Socket.io server
// ---------------------------
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);

      const isAllowed =
        allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin);

      if (isAllowed) cb(null, true);
      else cb(new Error("Not allowed by CORS (socket): " + origin));
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Track online users
let onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("⚡ New socket connected:", socket.id);

  socket.on("addUser", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log("✅ User online:", userId);
    io.emit("getUsers", Array.from(onlineUsers.keys()));
  });

  socket.on("sendMessage", ({ senderId, receiverId, text, image, _id }) => {
    const receiverSocketId = onlineUsers.get(receiverId);
    const messagePayload = {
      senderId,
      receiverId,
      text,
      image,
      _id,
      createdAt: new Date(),
    };

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("getMessage", messagePayload);
    }

    socket.emit("getMessage", messagePayload);
  });

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

// Attach io to app (optional: if controllers need it)
app.set("io", io);

// ---------------------------
// ✅ Start server
// ---------------------------
const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
