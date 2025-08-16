export default function ChatList({ users, selectUser, selectedUser }) {
  return (
    <div className="bg-gray-800 border-r border-gray-700 shadow-md h-full">
      {users.map((u) => (
        <div
          key={u._id}
          onClick={() => selectUser(u)}
          className={`p-3 cursor-pointer flex items-center gap-3 rounded-md transition-colors ${selectedUser?._id === u._id
            ? "bg-blue-600 text-white"
            : "hover:bg-gray-700 text-gray-200"
            }`}
        >
          <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center font-bold text-gray-100">
            {u.name?.[0]?.toUpperCase() || "?"}
          </div>
          <div className="flex-1">
            <p className="font-medium">{u.name}</p>
            <p className="text-xs text-gray-400 truncate">
              Last message preview...
            </p>
          </div>
        </div>
      ))}
    </div>
  );

}
