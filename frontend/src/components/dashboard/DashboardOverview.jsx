import { FaCalendarAlt, FaHeart, FaSmile } from "react-icons/fa";
import PhaseCard from "./PhaseCard";
import CycleCalendar from "../calendar/CycleCalendar";
import StatsCard from "../common/StatsCard";
import Insights from "./Insights";

function DashboardOverview({
  currentCycleDay,
  currentPhase,
  phaseInfo,
  nextPeriodDate,
  avgCycleLength,
  todayMood,
  getMoodEmoji,
  isPeriodDay,
  isPredictedDay,
  isFertileDay,
  isOvulationDay,
}) {
  return (
    <>
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-5 mb-8">
        <div>
          <p className="text-gray-500 mb-1">Welcome back 🌸</p>
          <h1 className="text-4xl font-bold">Your Cycle Journey</h1>
        </div>
        {currentCycleDay && (
          <div className="bg-gradient-to-r from-pink-100 to-purple-100 text-pink-600 px-6 py-3 rounded-2xl font-bold text-lg w-fit shadow-sm">
            Day {currentCycleDay}
          </div>
        )}
      </div>

      {/* PHASE CARD & CALENDAR */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-8 rounded-[32px] shadow-md mb-8">
        <PhaseCard currentPhase={currentPhase} phaseInfo={phaseInfo} />
        <CycleCalendar
          isPeriodDay={isPeriodDay}
          isPredictedDay={isPredictedDay}
          isFertileDay={isFertileDay}
          isOvulationDay={isOvulationDay}
        />
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <StatsCard
          title="Next Period"
          value={nextPeriodDate}
          color="bg-pink-50"
          icon={<FaCalendarAlt className="text-pink-400" />}
        />
        <StatsCard
          title="Cycle Length"
          value={`${avgCycleLength} days`}
          color="bg-purple-50"
          icon={<FaHeart className="text-purple-400" />}
        />
        <StatsCard
          title="Today's Mood"
          value={todayMood ? `${getMoodEmoji(todayMood.mood_type)} ${todayMood.mood_type}` : "Not logged"}
          color="bg-rose-50"
          icon={<FaSmile className="text-rose-400" />}
        />
      </div>

      {/* ARTICLES */}
      <Insights />
    </>
  );
}

export default DashboardOverview;
