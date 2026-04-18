"use client";

import { useState } from "react";
import { db, auth } from "../utils/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function AddClimbPage() {
  const [form, setForm] = useState({
    gym: "",
    route: "",
    grade: "",
    attempts: "",
    result: "",
    notes: "",
    date: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!auth.currentUser) return;

    await addDoc(collection(db, "climbs"), {
      ...form,
      attempts: Number(form.attempts),
      userId: auth.currentUser.uid,
      createdAt: serverTimestamp(),
    });

    setForm({
      gym: "",
      route: "",
      grade: "",
      attempts: "",
      result: "",
      notes: "",
      date: "",
    });
  };

  return (
    <div className="flex justify-center">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-emerald-900/10 border border-emerald-900/20 p-6 rounded-xl space-y-4"
      >

        <h1 className="text-xl font-bold text-center text-white">
          Add Climb
        </h1>

        {/* INPUT RENDERING */}
        {Object.keys(form).map((key) => {

          // RESULT DROPDOWN
          if (key === "result") {
            return (
              <select
                key={key}
                name={key}
                value={form[key]}
                onChange={(e) =>
                  setForm({ ...form, result: e.target.value })
                }
                className="w-full p-2 rounded border border-emerald-900/20"
              >
                <option value="">Select Result</option>
                <option value="Success">Success</option>
                <option value="Fail">Fail</option>
              </select>
            );
          }

          // DATE PICKER
          if (key === "date") {
            return (
              <input
                key={key}
                type="date"
                name={key}
                value={form[key]}
                onChange={(e) =>
                  setForm({ ...form, date: e.target.value })
                }
                className="w-full p-2 rounded border border-emerald-900/20"
              />
            );
          }

          // DEFAULT INPUT
          return (
            <input
              key={key}
              name={key}
              value={form[key]}
              placeholder={key}
              onChange={(e) =>
                setForm({ ...form, [key]: e.target.value })
              }
              className="w-full p-2 rounded border border-emerald-900/20"
            />
          );
        })}

        <button className="w-full bg-emerald-700 text-white p-2 rounded hover:bg-emerald-800">
          Add Climb
        </button>

      </form>

    </div>
  );
}