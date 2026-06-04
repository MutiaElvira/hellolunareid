import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { createTileClassName } from "../../utils/calendarHelpers";

function CycleCalendar({ isPeriodDay, isPredictedDay, isFertileDay, isOvulationDay }) {
  const [date, setDate] = useState(new Date());

  const tileClassName = createTileClassName({
    isPeriodDay,
    isPredictedDay,
    isFertileDay,
    isOvulationDay
  });

  return (
    <>
      <Calendar
        onChange={setDate}
        value={date}
        className="border-none w-full"
        tileClassName={tileClassName}
      />

      {/* LEGEND */}
      <div className="flex flex-wrap gap-4 mt-5 pt-4 border-t border-pink-100">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="w-3 h-3 rounded-full bg-pink-400 inline-block"></span>
          Period
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="w-3 h-3 rounded-full bg-green-300 inline-block"></span>
          Fertile Window
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="w-3 h-3 rounded-full bg-blue-300 inline-block"></span>
          Ovulation
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="w-3 h-3 rounded-full border-2 border-dashed border-purple-400 inline-block"></span>
          Predicted
        </div>
      </div>
    </>
  );
}

export default CycleCalendar;
