import { useState } from "react";
import { FaCalendarAlt, FaStar, FaPen, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import dayjs from "dayjs";

function PeriodHistory({ periods, updatePeriod, deletePeriod, showConfirm }) {
  const [editingId, setEditingId] = useState(null);
  const [editStart, setEditStart] = useState("");
  const [editEnd, setEditEnd] = useState("");
  const [editMood, setEditMood] = useState("");

  const handleEditStart = (item) => {
    setEditingId(item.id);
    setEditStart(item.start_date);
    setEditEnd(item.end_date);
    setEditMood(item.mood || "");
  };

  const handleEditSave = async () => {
    if (dayjs(editEnd).isBefore(dayjs(editStart))) {
      return;
    }

    const success = await updatePeriod(editingId, {
      start_date: editStart,
      end_date: editEnd,
      mood: editMood || null,
    });

    if (success) {
      setEditingId(null);
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
  };

  const handleDelete = (id) => {
    showConfirm(
      "Hapus Data Periode",
      "Apakah Anda yakin ingin menghapus data periode ini? Tindakan ini tidak dapat dibatalkan.",
      async () => {
        await deletePeriod(id);
      }
    );
  };

  return (
    <div className="bg-white border border-pink-100 p-8 rounded-[32px] shadow-sm">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FaStar className="text-purple-400" />
        Period History
      </h2>

      {periods.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <FaCalendarAlt className="text-5xl mx-auto mb-4 text-pink-200" />
          <p className="text-lg font-medium">No periods logged yet</p>
          <p className="text-sm mt-1">Start tracking by adding your first period above</p>
        </div>
      ) : (
        <div className="space-y-4">
          {periods.map((item) => (
            <div
              key={item.id}
              className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-5 flex justify-between items-center transition hover:shadow-sm"
            >
              {editingId === item.id ? (
                /* EDIT MODE */
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="date"
                      value={editStart}
                      onChange={(e) => setEditStart(e.target.value)}
                      className="p-3 rounded-xl border border-pink-200 outline-none focus:border-pink-400 text-sm"
                    />
                    <input
                      type="date"
                      value={editEnd}
                      onChange={(e) => setEditEnd(e.target.value)}
                      className="p-3 rounded-xl border border-pink-200 outline-none focus:border-pink-400 text-sm"
                    />
                    <select
                      value={editMood}
                      onChange={(e) => setEditMood(e.target.value)}
                      className="p-3 rounded-xl border border-pink-200 outline-none focus:border-pink-400 bg-white text-sm"
                    >
                      <option value="">No mood</option>
                      <option value="happy">😊 Happy</option>
                      <option value="sad">😢 Sad</option>
                      <option value="angry">😤 Angry</option>
                      <option value="anxious">😰 Anxious</option>
                      <option value="tired">😴 Tired</option>
                      <option value="neutral">😐 Neutral</option>
                    </select>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={handleEditSave}
                      className="bg-green-100 text-green-600 p-2 rounded-xl hover:bg-green-200 transition"
                    >
                      <FaCheck />
                    </button>
                    <button
                      onClick={handleEditCancel}
                      className="bg-gray-100 text-gray-500 p-2 rounded-xl hover:bg-gray-200 transition"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              ) : (
                /* VIEW MODE */
                <>
                  <div>
                    <p className="font-semibold text-gray-700">
                      {dayjs(item.start_date).format("DD MMM YYYY")} →{" "}
                      {dayjs(item.end_date).format("DD MMM YYYY")}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      {(dayjs(item.end_date).diff(dayjs(item.start_date), "day") + 1)} days
                      {item.mood && ` · Mood: ${item.mood}`}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditStart(item)}
                      className="bg-white text-purple-400 p-2.5 rounded-xl hover:bg-purple-50 transition shadow-sm"
                      title="Edit"
                    >
                      <FaPen className="text-sm" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-white text-red-400 p-2.5 rounded-xl hover:bg-red-50 transition shadow-sm"
                      title="Delete"
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PeriodHistory;
