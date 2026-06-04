import dayjs from "dayjs";

export const formatReportDate = (date) => {
  return dayjs(date).format("DD MMM YYYY");
};

export const formatReportDateTime = (date) => {
  return dayjs(date).format("DD MMMM YYYY, HH:mm");
};

export const calculateMoodDistribution = (moods) => {
  const moodCounts = {};
  let totalMoodsCount = 0;
  
  moods.forEach((m) => {
    moodCounts[m.mood_type] = (moodCounts[m.mood_type] || 0) + 1;
    totalMoodsCount++;
  });

  return { moodCounts, totalMoodsCount };
};

export const getRecentNotes = (moods, limit = 3) => {
  return moods.filter(m => m.note).slice(0, limit);
};

export const getHealthTips = (prediction) => {
  if (prediction?.has_data) {
    return prediction.avg_cycle_length < 21 || prediction.avg_cycle_length > 35
      ? "Siklus menstruasi Anda terdeteksi di luar rentang rata-rata umum (21-35 hari). Hal ini normal bagi beberapa individu, namun kami menyarankan untuk tetap berkonsultasi dengan penyedia layanan kesehatan jika pola ini terus berlanjut."
      : "Siklus menstruasi Anda terpantau berada di rentang normal (21-35 hari). Pertahankan gaya hidup sehat, konsumsi air putih yang cukup, dan kelola stres dengan baik untuk menjaga kestabilan hormon Anda.";
  } else {
    return "Catat terus data menstruasi Anda untuk mendapatkan analisis siklus dan prediksi masa subur yang akurat dari Lunare.";
  }
};
