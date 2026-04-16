"use client";

import { useState } from "react";

export default function AddClimbPage() {
  const [form, setForm] = useState({
    gym: "",
    route: "",
    grade: "",
    attempts: "",
    result: "",
    notes: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h1>Add Climb</h1>

      <input name="gym" placeholder="Gym" onChange={handleChange} />
      <br /><br />

      <input name="route" placeholder="Route" onChange={handleChange} />
      <br /><br />

      <input name="grade" placeholder="Grade" onChange={handleChange} />
      <br /><br />

      <input name="attempts" placeholder="Attempts" onChange={handleChange} />
      <br /><br />

      <input name="result" placeholder="Result" onChange={handleChange} />
      <br /><br />

      <input name="notes" placeholder="Notes" onChange={handleChange} />
      <br /><br />

      <button>Add Climb</button>
    </div>
  );
}