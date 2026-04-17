import Link from "next/link";
import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";

export const metadata = {
  title: "Climbing Tracker",
  description: "Track climbing routes and progress",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>

        <AuthProvider>

          <nav style={{ padding: "10px", display: "flex", gap: "10px" }}>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/add-climb">Add Climb</Link>
            <Link href="/history">History</Link>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </nav>

          <main style={{ padding: "20px" }}>
            {children}
          </main>

        </AuthProvider>

      </body>
    </html>
  );
}