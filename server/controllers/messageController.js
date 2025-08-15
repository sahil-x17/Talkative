import Message from "../models/messageModel.js";
import cloudinary from "../utils/cloudinary.js";

// Send message
export const sendMessage = async (req, res) => {
    try {
        const { receiverId, text, image } = req.body;

        let imageUrl = "";
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image, {
                folder: "chat_app_images"
            });
            imageUrl = uploadResponse.secure_url;
        }

        const message = await Message.create({
            sender: req.user.id,
            receiver: receiverId,
            text,
            image: imageUrl
        });

        res.status(201).json(message);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get conversation between two users
export const getMessages = async (req, res) => {
    try {
        const otherUserId = req.params.userId;

        const messages = await Message.find({
            $or: [
                { sender: req.user.id, receiver: otherUserId },
                { sender: otherUserId, receiver: req.user.id }
            ]
        }).sort({ createdAt: 1 });

        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
