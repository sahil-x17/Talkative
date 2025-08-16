import { useState, useEffect, useContext, useCallback } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { SocketContext } from "../context/SocketContext";
import ChatWindow from "../components/ChatWindow";
import ChatList from "../components/ChatList";

export default function Chat() {
  const { user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);

  // Load users
  useEffect(() => {
    API.get("/users").then(res => setUsers(res.data));
  }, []);

  // Load messages when user changes
  useEffect(() => {
    if (!selectedUser) return;
    API.get(`/messages/${selectedUser._id}`).then(res => setMessages(res.data));
  }, [selectedUser]);

  // Handle incoming messages from socket
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (msg) => {
      // Only add messages NOT sent by current user
      if (
        (msg.senderId === selectedUser?._id || msg.receiverId === selectedUser?._id) &&
        msg.senderId !== user._id
      ) {
        setMessages(prev => [...prev, msg]);
      }
    };

    socket.on("getMessage", handleMessage);
    return () => socket.off("getMessage", handleMessage);
  }, [socket, selectedUser, user._id]);

  // Send message
  const sendMessage = useCallback(async (text) => {
    if (!selectedUser || !text) return;

    try {
      const res = await API.post("/messages", {
        receiverId: selectedUser._id,
        text,
      });

      // Add message locally
      setMessages(prev => [...prev, res.data]);

      // Emit to socket
      socket?.emit("sendMessage", {
        senderId: user._id,
        receiverId: selectedUser._id,
        text: res.data.text,
        _id: res.data._id,
      });
    } catch (err) {
      console.error("Failed to send message", err);
    }
  }, [selectedUser, user._id, socket]);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200 overflow-hidden">
      {/* Sidebar / Chat list */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 shadow-lg flex flex-col">
        <div className="p-4 font-bold text-xl border-b border-gray-700 shrink-0">Chats</div>
        <div className="flex-1 overflow-y-auto min-h-0">
          <ChatList
            users={users}
            selectUser={setSelectedUser}
            selectedUser={selectedUser}
          />
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 min-h-0 flex flex-col bg-gray-900">
        {selectedUser ? (
          <ChatWindow
            messages={messages}
            selectedUser={selectedUser}
            sendMessage={sendMessage}
            currentUser={user}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-lg">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );

}
