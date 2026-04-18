"use client";

import { useState } from "react";
import { auth } from "../app/utils/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();

    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
        router.push("/dashboard");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        setMessage("Account created! Please log in.");
        setMode("login");
      }
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen flex items-center justify-center">

      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-700 via-slate-500 to-gray-300"></div>
      <div className="absolute inset-0 backdrop-blur-3xl opacity-60"></div>

      {/* GLASS CARD */}
      <div className="relative z-10 w-full max-w-md p-8 rounded-2xl bg-black/20 backdrop-blur-xl border border-white/30 shadow-2xl">

        <h1 className="text-3xl font-bold text-center mb-6">ClimbR</h1>

        <div className="flex bg-white/30 p-1 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`w-1/2 py-2 rounded-lg ${mode === "login" ? "bg-white shadow text-emerald-600" : ""
              }`}
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => setMode("register")}
            className={`w-1/2 py-2 rounded-lg ${mode === "register" ? "bg-white shadow text-emerald-600" : ""
              }`}
          >
            Register
          </button>
        </div>

        {/* FORM WRAPPER */}
        <form onSubmit={handleAuth}>

          <input
            className="w-full p-3 mb-3 rounded-xl bg-white/30 border border-white/40"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full p-3 mb-4 rounded-xl bg-white/30 border border-white/40"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full p-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600"
          >
            {mode === "login" ? "Sign In" : "Create Account"}
          </button>

        </form>

        {message && (
          <p className="text-center text-sm mt-4 text-gray-700">
            {message}
          </p>
        )}

      </div>
    </div>
  );
}