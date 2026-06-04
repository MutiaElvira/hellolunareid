import { useState } from "react";

function MoodPicker({ todayMood, getMoodEmoji, MOOD_TYPES, handleMoodSelect }) {
  const [moodNote, setMoodNote] = useState("");

  const onMoodClick = async (type) => {
    await handleMoodSelect(type, moodNote);
    setMoodNote(""); // clear after saving
  };

  return (
    <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-8 rounded-[32px] shadow-md mb-8">
      <h2 className="text-xl font-bold mb-6">
        {todayMood
          ? `Today you feel ${getMoodEmoji(todayMood.mood_type)} ${todayMood.mood_type}`
          : "Select your mood for today"
        }
      </h2>

      <div className="grid grid-cols-4 md:grid-cols-8 gap-3 mb-5">
        {MOOD_TYPES.map((m) => (
          <button
            key={m.type}
            onClick={() => onMoodClick(m.type)}
            className={`flex flex-col items-center p-4 rounded-2xl transition-all duration-200 ${
              todayMood?.mood_type === m.type
                ? "bg-gradient-to-b from-pink-200 to-purple-200 shadow-md scale-105"
                : "bg-white hover:bg-pink-50 hover:scale-105 shadow-sm"
            }`}
          >
            <span className="text-2xl mb-1">{m.emoji}</span>
            <span className="text-xs text-gray-500 font-medium">{m.label}</span>
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder="Add a note about how you feel... (optional)"
        value={moodNote}
        onChange={(e) => setMoodNote(e.target.value)}
        className="w-full p-4 rounded-2xl border border-pink-100 outline-none focus:border-pink-300 bg-white transition"
      />
    </div>
  );
}

export default MoodPicker;
