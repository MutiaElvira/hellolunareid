import { phaseColors, phaseRiskLabel } from "../../utils/calendarHelpers";

function PhaseCard({ currentPhase, phaseInfo }) {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
      <div>
        <p className="text-gray-500 mb-1">Current Phase</p>
        <h2 className="text-3xl font-bold">
          {currentPhase || "Unknown"} {phaseInfo.emoji}
        </h2>
        <p className="text-gray-400 mt-1 text-sm">
          {phaseInfo.description}
        </p>
      </div>

      {currentPhase && (
        <div className={`px-5 py-2.5 rounded-2xl font-semibold w-fit ${phaseColors[currentPhase] || "bg-gray-100 text-gray-600"}`}>
          {phaseRiskLabel[currentPhase] || "—"}
        </div>
      )}
    </div>
  );
}

export default PhaseCard;
