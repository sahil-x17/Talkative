import { useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { register as apiRegister } from "../services/auth";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await apiRegister(form);
    login(res.data);
    navigate("/chat");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded shadow-md w-full max-w-sm"
      >
        <input
          name="name"
          onChange={handleChange}
          placeholder="Name"
          className="border border-gray-700 p-2 mb-2 w-full rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          name="email"
          onChange={handleChange}
          placeholder="Email"
          className="border border-gray-700 p-2 mb-2 w-full rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          name="password"
          type="password"
          onChange={handleChange}
          placeholder="Password"
          className="border border-gray-700 p-2 mb-4 w-full rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full transition-colors"
        >
          Register
        </button>
      </form>
    </div>
  );

}
