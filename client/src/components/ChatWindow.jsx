import { useEffect, useRef } from "react";
import InputBox from "./InputBox";
import Message from "./Message";

export default function ChatWindow({
  messages,
  selectedUser,
  sendMessage,
  currentUser,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 text-lg">
        Select a user to start chatting
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-gray-900 text-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 bg-gray-800 shadow-sm flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center font-bold text-gray-100">
          {selectedUser.name?.[0]?.toUpperCase() || "?"}
        </div>
        <span className="font-semibold text-lg">{selectedUser.username}</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {/* Inner flex ensures content sticks to bottom when short */}
        <div className="h-full flex flex-col justify-end p-4 space-y-3">
          {messages.map((m, i) => {
            const isSender =
              String(m.senderId ?? m.sender) === String(currentUser._id);
            return (
              <div
                key={m._id || i}
                className={`flex ${isSender ? "justify-end" : "justify-start"}`}
              >
                <Message text={m.text} sender={isSender} />
              </div>
            );
          })}
          {/* Bottom anchor for smooth scroll */}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <InputBox sendMessage={sendMessage} />
    </div>
  );
}
