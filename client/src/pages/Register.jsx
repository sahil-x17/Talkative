import { useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { register as apiRegister } from "../services/auth";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1 = send OTP, 2 = verify OTP, 3 = registration
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendOtp = async () => {
    if (!form.email) {
      alert("Please enter your email");
      return;
    }
    try {
      await API.post("/otp/send-otp", { email: form.email });
      alert("OTP sent to your email");
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.message || "Error sending OTP");
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      alert("Please enter OTP");
      return;
    }
    try {
      await API.post("/otp/verify-otp", { email: form.email, otp });
      alert("OTP verified");
      setStep(3);
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiRegister(form);
      login(res.data);
      navigate("/chat");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded shadow-md w-full max-w-sm"
      >
        {/* Step 1: Send OTP */}
        {step === 1 && (
          <>
            <input
              name="email"
              onChange={handleChange}
              placeholder="Email"
              className="border border-gray-700 p-2 mb-4 w-full rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="button"
              onClick={sendOtp}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full transition-colors"
            >
              Send OTP
            </button>
          </>
        )}

        {/* Step 2: Verify OTP */}
        {step === 2 && (
          <>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="border border-gray-700 p-2 mb-4 w-full rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="button"
              onClick={verifyOtp}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full transition-colors"
            >
              Verify OTP
            </button>
          </>
        )}

        {/* Step 3: Full Registration */}
        {step === 3 && (
          <>
            <input
              name="name"
              onChange={handleChange}
              placeholder="Name"
              className="border border-gray-700 p-2 mb-2 w-full rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              name="email"
              value={form.email}
              disabled
              className="border border-gray-700 p-2 mb-2 w-full rounded bg-gray-700 text-gray-400"
            />
            <input
              name="password"
              type="password"
              onChange={handleChange}
              placeholder="Password"
              className="border border-gray-700 p-2 mb-4 w-full rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full transition-colors"
            >
              Register
            </button>
          </>
        )}
      </form>
    </div>
  );
}
