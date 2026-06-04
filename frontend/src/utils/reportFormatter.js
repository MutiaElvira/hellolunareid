import dayjs from "dayjs";

export const formatReportDate = (date) => {
  return dayjs(date).format("DD MMM YYYY");
};

export const formatReportDateTime = (date) => {
  return dayjs(date).format("DD MMMM YYYY, HH:mm");
};

export const SYMPTOM_LABELS = {
  cramps: "Kram Perut 😫",
  headache: "Sakit Kepala 🤕",
  bloating: "Kembung 🎈",
  fatigue: "Kelelahan 😴",
  acne: "Jerawat 🔴",
  breast_tenderness: "Nyeri Payudara 🍈",
  insomnia: "Insomnia 👁️",
  mood_swings: "Perubahan Mood 📈",
  anxiety: "Cemas 😰",
  depressed: "Sedih / Depresi 😢",
};

export const calculateSymptomDistribution = (symptoms) => {
  const symptomCounts = {};
  let totalLogs = 0;

  symptoms.forEach((s) => {
    Object.keys(SYMPTOM_LABELS).forEach((key) => {
      if (s[key] && s[key] !== "") {
        symptomCounts[key] = (symptomCounts[key] || 0) + 1;
        totalLogs++;
      }
    });
  });

  return { symptomCounts, totalLogs };
};

export const getRecentNotes = (symptoms, limit = 3) => {
  return symptoms
    .filter((s) => s.note && s.note.trim() !== "")
    .slice(0, limit);
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
