import { useState } from "react";

export default function InputBox({ sendMessage }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessage(text.trim());
    setText("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border-t border-gray-700 bg-gray-800 flex"
    >
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 border border-gray-600 bg-gray-700 text-gray-200 placeholder-gray-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="ml-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Send
      </button>
    </form>
  );
}
