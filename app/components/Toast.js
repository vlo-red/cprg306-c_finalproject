"use client";

export default function Toast({ message, type }) {
  if (!message) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        padding: "12px 16px",
        borderRadius: "8px",
        color: "white",
        backgroundColor: type === "error" ? "#e74c3c" : "#2ecc71",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        zIndex: 9999,
      }}
    >
      {message}
    </div>
  );
}