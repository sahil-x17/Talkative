import { useState } from "react";
import axios from "axios";

export default function OtpForm({ onVerified }) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);

  const sendOtp = async () => {
    try {
      await axios.post("/api/otp/send-otp", { email });
      setStep(2);
      alert("OTP sent to your email");
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const verifyOtp = async () => {
    try {
      await axios.post("/api/otp/verify-otp", { email, otp });
      alert("OTP verified");
      onVerified(email); // pass email to parent for registration
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div className="p-4 border rounded">
      {step === 1 && (
        <>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full mb-2"
          />
          <button onClick={sendOtp} className="bg-blue-500 text-white px-4 py-2 rounded">
            Send OTP
          </button>
        </>
      )}
      {step === 2 && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border p-2 w-full mb-2"
          />
          <button onClick={verifyOtp} className="bg-green-500 text-white px-4 py-2 rounded">
            Verify OTP
          </button>
        </>
      )}
    </div>
  );
}
