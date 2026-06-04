import dayjs from "dayjs";

export const phaseColors = {
  Menstrual: "bg-red-100 text-red-600",
  Follicular: "bg-pink-100 text-pink-600",
  Ovulation: "bg-purple-100 text-purple-600",
  Luteal: "bg-indigo-100 text-indigo-600",
};

export const phaseRiskLabel = {
  Menstrual: "Period",
  Follicular: "Low Fertility",
  Ovulation: "High Fertility",
  Luteal: "Low Fertility",
};

export const getPhaseInfo = (phase) => {
  switch (phase) {
    case "Menstrual":
      return { emoji: "🩸", description: "Take it easy, rest and hydrate", color: "menstrual" };
    case "Follicular":
      return { emoji: "🌸", description: "Energy is rising, great for new projects", color: "follicular" };
    case "Ovulation":
      return { emoji: "✨", description: "Peak energy and fertility", color: "ovulation" };
    case "Luteal":
      return { emoji: "🌙", description: "Wind down, practice self-care", color: "luteal" };
    default:
      return { emoji: "🌸", description: "Track your cycle to see insights", color: "default" };
  }
};

export const createTileClassName = ({ isPeriodDay, isPredictedDay, isFertileDay, isOvulationDay }) => {
  return ({ date: tileDate, view }) => {
    if (view !== "month") return null;

    const dateStr = dayjs(tileDate).format("YYYY-MM-DD");
    const classes = [];

    if (isPeriodDay(dateStr)) {
      classes.push("period-day");
    }
    if (isPredictedDay(dateStr)) {
      classes.push("predicted-day");
    }
    if (isFertileDay(dateStr)) {
      classes.push("fertile-day");
    }
    if (isOvulationDay(dateStr)) {
      classes.push("ovulation-day");
    }

    return classes.length > 0 ? classes.join(" ") : null;
  };
};
