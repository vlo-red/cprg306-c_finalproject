"use client";

import { useEffect, useState } from "react";
import { db, auth } from "../utils/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function DashboardPage() {
  const [climbs, setClimbs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchClimbs = async () => {
      if (!user) {
        setClimbs([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      const q = query(
        collection(db, "climbs"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);

      setClimbs(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };

    fetchClimbs();
  }, [user]);

  const totalClimbs = climbs.length;

  const successRate =
    totalClimbs === 0
      ? 0
      : Math.round(
        (climbs.filter((c) => c.result === "Success").length /
          totalClimbs) *
        100
      );

  const recentClimbs = climbs.slice(0, 5);

  if (loading) return <p className="text-center">Loading dashboard...</p>;

  if (!user)
    return (
      <p className="text-center text-gray-600">
        Please log in to view your dashboard.
      </p>
    );

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold text-center">
        Dashboard
      </h1>

      <p className="text-center text-gray-600">
        Welcome to your Climbing Tracker
      </p>

      {/* STATS */}
      <div className="bg-emerald-900/20 text-white p-4 rounded-lg space-y-2">
        <p>Total Climbs: {totalClimbs}</p>
        <p>Success Rate: {successRate}%</p>
      </div>

      {/* RECENT CLIMBS */}
      <div className="bg-emerald-900/20 text-white p-4 rounded-lg space-y-2">
        <h3 className="font-semibold">Recent Climbs</h3>

        {recentClimbs.length === 0 ? (
          <p>No climbs yet</p>
        ) : (
          recentClimbs.map((climb) => (
            <div key={climb.id} className="border-b py-2">
              <p className="font-medium">
                {climb.route} ({climb.grade})
              </p>

              <p className="text-sm">
                {climb.gym} • {climb.result}
              </p>

              <p className="text-xs">
                Attempts: {climb.attempts} • Date: {climb.date}
              </p>

              {climb.notes && (
                <p className="text-xs">Notes: {climb.notes}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}