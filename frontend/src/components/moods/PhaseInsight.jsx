import { FaHeart } from "react-icons/fa";
import { phaseColors } from "../../utils/calendarHelpers";

function PhaseInsight({ currentPhase, phaseInfo }) {
  if (!currentPhase) return null;

  return (
    <div className="bg-white border border-pink-100 p-6 rounded-[32px] shadow-sm mb-8">
      <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
        <FaHeart className="text-pink-400" />
        Phase Insight
      </h3>
      <div className={`inline-block px-4 py-2 rounded-2xl font-medium text-sm mb-3 ${phaseColors[currentPhase]}`}>
        {currentPhase} Phase {phaseInfo.emoji}
      </div>
      <p className="text-gray-500 text-sm">{phaseInfo.description}</p>

      {currentPhase === "Menstrual" && (
        <div className="mt-4 bg-red-50 p-4 rounded-2xl text-sm text-red-600">
          💡 <strong>Tip:</strong> Warm compresses, gentle stretches, and staying hydrated can help with cramps.
        </div>
      )}
      {currentPhase === "Follicular" && (
        <div className="mt-4 bg-pink-50 p-4 rounded-2xl text-sm text-pink-600">
          💡 <strong>Tip:</strong> Your energy is rising! Great time to start new projects and try new workouts.
        </div>
      )}
      {currentPhase === "Ovulation" && (
        <div className="mt-4 bg-purple-50 p-4 rounded-2xl text-sm text-purple-600">
          💡 <strong>Tip:</strong> You're at peak energy. Social activities and high-intensity workouts feel great now.
        </div>
      )}
      {currentPhase === "Luteal" && (
        <div className="mt-4 bg-indigo-50 p-4 rounded-2xl text-sm text-indigo-600">
          💡 <strong>Tip:</strong> PMS may start. Focus on comfort foods rich in magnesium and gentle movement.
        </div>
      )}
    </div>
  );
}

export default PhaseInsight;
