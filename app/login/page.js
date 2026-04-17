"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/firebase";
import Toast from "../components/Toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState({ message: "", type: "" });

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setToast({ message: "Login successful!", type: "success" });
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setToast({ message: "Invalid email", type: "error" });
      } else if (err.code === "auth/wrong-password") {
        setToast({ message: "Invalid password entered", type: "error" });
      } else {
        setToast({ message: "Login failed", type: "error" });
      }
    }
  };

  return (
    <div>
      <Toast message={toast.message} type={toast.type} />

      <h1>Login</h1>

      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={login} style={buttonStyle}>
        Login
      </button>
    </div>
  );
}

const buttonStyle = {
  padding: "10px 16px",
  backgroundColor: "#2ecc71",
  border: "none",
  color: "white",
  borderRadius: "6px",
  cursor: "pointer",
};