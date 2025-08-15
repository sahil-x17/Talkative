export default function Message({ text, sender }) {
  return (
    <span
      className={`inline-block p-2 rounded-lg max-w-xs break-words ${sender
          ? "bg-blue-600 text-white"
          : "bg-gray-700 text-gray-200"
        }`}
    >
      {text}
    </span>
  );
}
