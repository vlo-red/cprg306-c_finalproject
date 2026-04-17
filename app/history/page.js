"use client";

import { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

export default function HistoryPage() {
  const { user } = useAuth();

  const [climbs, setClimbs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingClimb, setEditingClimb] = useState(null);
  const [editForm, setEditForm] = useState({
    gym: "",
    route: "",
    grade: "",
    attempts: "",
    result: "",
    notes: "",
    date: "",
  });

  // ---------------- FETCH ----------------
  useEffect(() => {
    const fetchClimbs = async () => {
      if (!user) {
        setLoading(false);
        setError("You must be logged in to view history");
        return;
      }

      try {
        const q = query(
          collection(db, "climbs"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setClimbs(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load history");
      }

      setLoading(false);
    };

    fetchClimbs();
  }, [user]);

  // ---------------- DELETE ----------------
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "climbs", id));
      setClimbs((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete climb");
    }
  };

  // ---------------- EDIT START ----------------
  const startEdit = (climb) => {
    setEditingClimb(climb);
    setEditForm(climb);
  };

  // ---------------- UPDATE ----------------
  const handleUpdate = async () => {
    try {
      const ref = doc(db, "climbs", editingClimb.id);

      await updateDoc(ref, {
        ...editForm,
        attempts: Number(editForm.attempts),
      });

      setClimbs((prev) =>
        prev.map((c) =>
          c.id === editingClimb.id ? { ...c, ...editForm } : c
        )
      );

      setEditingClimb(null);
    } catch (err) {
      console.error(err);
      setError("Failed to update climb");
    }
  };

  // ---------------- LOADING ----------------
  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold">Loading history...</h1>
      </div>
    );
  }

  // ---------------- ERROR ----------------
  if (error) {
    return (
      <div className="p-6 text-red-600">
        <h1 className="text-xl font-bold">{error}</h1>
      </div>
    );
  }

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Your Climbing History</h1>

      {climbs.length === 0 ? (
        <p className="text-gray-600">No climbs recorded yet.</p>
      ) : (
        <div className="grid gap-4">
          {climbs.map((climb) => (
            <div key={climb.id} className="bg-white p-4 rounded shadow">
              <h2 className="font-bold text-lg">{climb.route}</h2>

              <p><strong>Gym:</strong> {climb.gym}</p>
              <p><strong>Grade:</strong> {climb.grade}</p>
              <p><strong>Attempts:</strong> {climb.attempts}</p>
              <p><strong>Result:</strong> {climb.result}</p>
              <p><strong>Date:</strong> {climb.date}</p>

              {climb.notes && (
                <p className="text-sm text-gray-600">
                  <strong>Notes:</strong> {climb.notes}
                </p>
              )}

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => startEdit(climb)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(climb.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---------------- EDIT MODAL ---------------- */}
      {editingClimb && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96 space-y-2">
            <h2 className="text-xl font-bold">Edit Climb</h2>

            {Object.keys(editForm).map((key) => (
              <input
                key={key}
                name={key}
                value={editForm[key]}
                onChange={(e) =>
                  setEditForm({ ...editForm, [key]: e.target.value })
                }
                className="w-full border p-2 rounded"
              />
            ))}

            <div className="flex gap-2 mt-3">
              <button
                onClick={handleUpdate}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Save
              </button>

              <button
                onClick={() => setEditingClimb(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}