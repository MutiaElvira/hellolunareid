import { useState } from "react";
import { FaSeedling } from "react-icons/fa";
import dayjs from "dayjs";

function AddPeriodForm({ addPeriod }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [formMood, setFormMood] = useState("");
  const [formError, setFormError] = useState("");

  const handleSave = async () => {
    setFormError("");

    if (!startDate || !endDate) {
      setFormError("Please fill in both start and end dates");
      return;
    }

    if (dayjs(endDate).isBefore(dayjs(startDate))) {
      setFormError("End date must be after start date");
      return;
    }

    const success = await addPeriod({
      start_date: startDate,
      end_date: endDate,
      mood: formMood || null,
    });

    if (success) {
      setStartDate("");
      setEndDate("");
      setFormMood("");
      setFormError("");
    } else {
      setFormError("Failed to save period. Please try again.");
    }
  };

  return (
    <div className="bg-white border border-pink-100 p-8 rounded-[32px] shadow-sm mb-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FaSeedling className="text-pink-400" />
        Add New Period
      </h2>

      {formError && (
        <div className="bg-red-50 text-red-500 p-4 rounded-2xl mb-5 text-sm font-medium">
          {formError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-4 rounded-2xl border border-pink-100 outline-none focus:border-pink-300 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-4 rounded-2xl border border-pink-100 outline-none focus:border-pink-300 transition"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-500 mb-2">Mood (optional)</label>
          <select
            value={formMood}
            onChange={(e) => setFormMood(e.target.value)}
            className="w-full p-4 rounded-2xl border border-pink-100 outline-none focus:border-pink-300 bg-white transition"
          >
            <option value="">Select mood...</option>
            <option value="happy">😊 Happy</option>
            <option value="sad">😢 Sad</option>
            <option value="angry">😤 Angry</option>
            <option value="anxious">😰 Anxious</option>
            <option value="tired">😴 Tired</option>
            <option value="neutral">😐 Neutral</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="mt-6 bg-gradient-to-r from-pink-300 to-purple-300 hover:from-pink-400 hover:to-purple-400 hover:scale-[1.02] transition-all text-white px-8 py-4 rounded-2xl font-semibold shadow-md"
      >
        Save Period
      </button>
    </div>
  );
}

export default AddPeriodForm;
