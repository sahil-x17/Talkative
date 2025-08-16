import nodemailer from "nodemailer";
import User from "../models/userModel.js"; // your user schema
import crypto from "crypto";

const otpStore = {}; // key: email, value: { otp, expiry }

export const sendOTP = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const otp = crypto.randomInt(100000, 999999); // 6-digit OTP
  const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes

  otpStore[email] = { otp, expiry };

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Talkative" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP for Registration in Talkative App",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });

    res.json({ message: "OTP sent to email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending OTP" });
  }
};

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!otpStore[email]) {
    return res.status(400).json({ message: "No OTP found or expired" });
  }

  const { otp: storedOtp, expiry } = otpStore[email];

  if (Date.now() > expiry) {
    delete otpStore[email];
    return res.status(400).json({ message: "OTP expired" });
  }

  if (parseInt(otp) !== storedOtp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  delete otpStore[email]; // Remove OTP after verification
  res.json({ message: "OTP verified" });
};
