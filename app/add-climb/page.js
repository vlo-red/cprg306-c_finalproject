"use client";

import { useState } from "react";
import { db } from "../utils/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

export default function AddClimbPage() {
  const { user } = useAuth();

  const [form, setForm] = useState({
    gym: "",
    route: "",
    grade: "",
    attempts: "",
    result: "",
    notes: "",
    date: "",
  });

  const [message, setMessage] = useState(null);
  const [errorField, setErrorField] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrorField("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (let key in form) {
      if (!form[key]) {
        setMessage("Please fill in all fields");
        setErrorField(key);
        return;
      }
    }

    // FIXED: use context instead of auth.currentUser
    if (!user) {
      setMessage("You must be logged in");
      return;
    }

    try {
      await addDoc(collection(db, "climbs"), {
        ...form,
        attempts: Number(form.attempts),
        userId: user.uid,
        createdAt: serverTimestamp(),
      });

      setMessage("Climb added successfully!");

      setForm({
        gym: "",
        route: "",
        grade: "",
        attempts: "",
        result: "",
        notes: "",
        date: "",
      });
    } catch (err) {
      console.error("FIREBASE ERROR:", err);
      setMessage("The climb could not be added");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-black p-6 rounded-lg shadow-md w-full max-w-md space-y-4"
      >
        <h1 className="text-xl font-bold text-center">Add Climb</h1>

        {message && (
          <div
            className={`text-sm p-2 rounded ${message.includes("success")
                ? "bg-green-200 text-green-800"
                : "bg-red-200 text-red-800"
              }`}
          >
            {message}
          </div>
        )}

        {[
          { name: "gym", placeholder: "Gym Name" },
          { name: "route", placeholder: "Route Name" },
          { name: "grade", placeholder: "Difficulty (V-scale)" },
          { name: "attempts", placeholder: "Attempts", type: "number" },
          { name: "result", placeholder: "Result (Success/Fail)" },
          { name: "notes", placeholder: "Notes" },
          { name: "date", placeholder: "Date", type: "date" },
        ].map((field) => (
          <input
            key={field.name}
            type={field.type || "text"}
            name={field.name}
            placeholder={field.placeholder}
            value={form[field.name]}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${errorField === field.name ? "border-red-500" : ""
              }`}
          />
        ))}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
        >
          Add Climb
        </button>
      </form>
    </div>
  );
}