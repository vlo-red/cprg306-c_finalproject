"use client";

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>

      <p>Welcome to your Climbing Tracker</p>

      <div style={{ marginTop: "20px" }}>
        <h3>Quick Stats</h3>
        <p>Total Climbs: 0</p>
        <p>Success Rate: 0%</p>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h3>Recent Climbs</h3>
        <p>No climbs yet</p>
      </div>
    </div>
  );
}