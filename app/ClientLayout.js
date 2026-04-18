"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "./utils/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function ClientLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  // HIDE NAVBAR ON LOGIN PAGE
  const hideNavbar = pathname === "/";

  return (
    <>
      {/* NAVBAR */}
      {!loading && !hideNavbar && (
        <nav className="fixed top-0 left-0 w-full z-50 
          bg-emerald-950/30 backdrop-blur-xl 
          border-b border-white/20 
          shadow-lg">

          <div className="max-w-5xl mx-auto flex items-center justify-center gap-6 p-4 text-white">

            <Link href="/dashboard" className="hover:text-emerald-300 transition">
              Dashboard
            </Link>

            <Link href="/add-climb" className="hover:text-emerald-300 transition">
              Add Climb
            </Link>

            <Link href="/history" className="hover:text-emerald-300 transition">
              History
            </Link>

            <button
              onClick={handleLogout}
              className="ml-auto text-red-300 hover:text-red-400 transition"
            >
              Logout
            </button>

          </div>
        </nav>
      )}

      <main className="pt-20 px-4 max-w-5xl mx-auto">
        {children}
      </main>
    </>
  );
}