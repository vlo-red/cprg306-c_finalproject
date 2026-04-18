"use client";

import { useEffect, useState } from "react";
import { db, auth } from "../utils/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  updateDoc,
} from "firebase/firestore";

export default function HistoryPage() {
  const [climbs, setClimbs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    const fetchClimbs = async () => {
      const user = auth.currentUser;

      if (!user) {
        setClimbs([]);
        setLoading(false);
        return;
      }

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
  }, []);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "climbs", id));
    setClimbs((prev) => prev.filter((c) => c.id !== id));
  };

  // EDITING
  const handleEdit = (climb) => {
    setEditingId(climb.id);
    setEditForm(climb);
  };

  // HANDLE INPUT CHANGES
  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // SAVE CHANGES
  const handleSave = async () => {
    const ref = doc(db, "climbs", editingId);

    await updateDoc(ref, {
      gym: editForm.gym,
      route: editForm.route,
      grade: editForm.grade,
      result: editForm.result,
      attempts: editForm.attempts,
      notes: editForm.notes,
      date: editForm.date,
    });

    setClimbs((prev) =>
      prev.map((c) =>
        c.id === editingId ? { ...c, ...editForm } : c
      )
    );

    setEditingId(null);
  };

  if (loading) return <p className="text-center">Loading...</p>;

  if (!auth.currentUser)
    return <p className="text-center">Please log in.</p>;

  return (
    <div className="space-y-4">

      <h1 className="text-2xl font-bold text-center text-white">
        Climb History
      </h1>

      {climbs.map((c) => (
        <div
          key={c.id}
          className="bg-emerald-900/10 border border-emerald-900/20 p-4 rounded-xl flex justify-between"
        >

          <div className="w-full">

            {editingId === c.id ? (
              <>
                <input
                  name="route"
                  value={editForm.route || ""}
                  onChange={handleChange}
                  className="border p-1 rounded w-full mb-1"
                />

                <input
                  name="gym"
                  value={editForm.gym || ""}
                  onChange={handleChange}
                  className="border p-1 rounded w-full mb-1"
                />

                <input
                  name="grade"
                  value={editForm.grade || ""}
                  onChange={handleChange}
                  className="border p-1 rounded w-full mb-1"
                />

                <input
                  name="attempts"
                  value={editForm.attempts || ""}
                  onChange={handleChange}
                  className="border p-1 rounded w-full mb-1"
                />

                <input
                  name="notes"
                  value={editForm.notes || ""}
                  onChange={handleChange}
                  className="border p-1 rounded w-full mb-1"
                />

                <input
                  type="date"
                  name="date"
                  value={editForm.date || ""}
                  onChange={handleChange}
                  className="border p-1 rounded w-full mb-1"
                />

                <select
                  name="result"
                  value={editForm.result || ""}
                  onChange={handleChange}
                  className="border p-1 rounded w-full"
                >
                  <option value="Success">Success</option>
                  <option value="Fail">Fail</option>
                </select>
              </>
            ) : (
              <>
                <p className="font-semibold">
                  {c.route} ({c.grade})
                </p>

                <p className="text-sm">{c.gym}</p>
                <p className="text-sm">Result: {c.result}</p>
                <p className="text-sm">Attempts: {c.attempts}</p>
                <p className="text-sm">Notes: {c.notes}</p>
                <p className="text-xs text-gray-500">Date: {c.date}</p>
              </>
            )}

          </div>

          <div className="flex flex-col gap-2 ml-4">

            {editingId === c.id ? (
              <button
                onClick={handleSave}
                className="text-green-500 hover:text-green-600"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => handleEdit(c)}
                className="text-blue-400 hover:text-blue-500"
              >
                Edit
              </button>
            )}

            <button
              onClick={() => handleDelete(c.id)}
              className="text-red-400 hover:text-red-500"
            >
              Delete
            </button>

          </div>

        </div>
      ))}

    </div>
  );
}