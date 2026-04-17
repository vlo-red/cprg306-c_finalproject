"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/firebase";
import Toast from "../components/Toast";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState({ message: "", type: "" });

  const register = async () => {
    // ---------------- VALIDATION ----------------
    if (!email.trim() || !password.trim()) {
      setToast({
        message: "Please fill in all fields",
        type: "error",
      });
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);

      setToast({
        message: "Account created successfully!",
        type: "success",
      });

      // reset form
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error("REGISTER ERROR:", err.code, err.message);

      switch (err.code) {
        case "auth/email-already-in-use":
          setToast({
            message: "Email has already been registered",
            type: "error",
          });
          break;

        case "auth/invalid-email":
          setToast({
            message: "Invalid email format",
            type: "error",
          });
          break;

        case "auth/weak-password":
          setToast({
            message: "Password must be at least 6 characters",
            type: "error",
          });
          break;

        case "auth/network-request-failed":
          setToast({
            message: "Network error. Try again",
            type: "error",
          });
          break;

        default:
          setToast({
            message: "Registration failed",
            type: "error",
          });
      }
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Toast message={toast.message} type={toast.type} />

      <h1>Register</h1>

      {/* EMAIL */}
      <input
        placeholder="Email"
        value={email ?? ""}
        onChange={(e) => setEmail(e.target.value)}
        style={inputStyle}
      />

      <br /><br />

      {/* PASSWORD */}
      <input
        type="password"
        placeholder="Password"
        value={password ?? ""}
        onChange={(e) => setPassword(e.target.value)}
        style={inputStyle}
      />

      <br /><br />

      {/* BUTTON */}
      <button onClick={register} style={buttonStyle}>
        Create Account
      </button>
    </div>
  );
}

// ---------------- STYLES ----------------
const inputStyle = {
  padding: "10px",
  width: "250px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const buttonStyle = {
  padding: "10px 16px",
  backgroundColor: "#9b59b6",
  border: "none",
  color: "white",
  borderRadius: "6px",
  cursor: "pointer",
  transition: "0.2s",
};