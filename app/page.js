"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>🧗 Rock Climbing Route Tracker</h1>

      <p style={{ marginTop: "10px" }}>
        Track your climbs, sessions, and progress over time.
      </p>

      <div style={{ marginTop: "30px", display: "flex", gap: "10px", justifyContent: "center" }}>
        <button onClick={() => router.push("/login")}>
          Login
        </button>

        <button onClick={() => router.push("/register")}>
          Register
        </button>

        <button onClick={() => router.push("/dashboard")}>
          Dashboard
        </button>
      </div>
    </div>
  );
}