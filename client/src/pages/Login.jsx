import { useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { login as apiLogin } from "../services/auth";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await apiLogin(form);
    login(res.data); // save in AuthContext
    navigate("/chat");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-lg shadow-lg w-80"
      >
        <input
          name="email"
          onChange={handleChange}
          placeholder="Email"
          className="bg-gray-700 text-white border border-gray-600 p-2 mb-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="password"
          type="password"
          onChange={handleChange}
          placeholder="Password"
          className="bg-gray-700 text-white border border-gray-600 p-2 mb-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full">
          Login
        </button>
        <button
          type="button"
          onClick={() => navigate("/register")}
          className="mt-3 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          Register
        </button>
      </form>
    </div>
  );

}
