import React, { useState, useEffect } from "react";
import { getSymptomByDate } from "../../services/symptomService";
import { Calendar, ChevronLeft, ChevronRight, Save, Smile, RefreshCw } from "lucide-react";
import dayjs from "dayjs";

const PHYSICAL_SYMPTOMS = [
  { id: "cramps", label: "Kram Perut", emoji: "😫" },
  { id: "headache", label: "Sakit Kepala", emoji: "🤕" },
  { id: "bloating", label: "Kembung", emoji: "🎈" },
  { id: "fatigue", label: "Kelelahan", emoji: "😴" },
  { id: "acne", label: "Jerawat", emoji: "🔴" },
  { id: "breast_tenderness", label: "Nyeri Payudara", emoji: "🍈" },
];

const MENTAL_SYMPTOMS = [
  { id: "insomnia", label: "Insomnia", emoji: "👁️" },
  { id: "mood_swings", label: "Perubahan Mood", emoji: "📈" },
  { id: "anxiety", label: "Cemas", emoji: "😰" },
  { id: "depressed", label: "Sedih / Depresi", emoji: "😢" },
];

function SymptomJournal({ saveSymptom }) {
  const [currentDate, setCurrentDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [loadingDate, setLoadingDate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [formState, setFormState] = useState({
    cramps: null,
    headache: null,
    bloating: null,
    fatigue: null,
    acne: null,
    breast_tenderness: null,
    insomnia: null,
    mood_swings: null,
    anxiety: null,
    depressed: null,
    note: "",
  });

  // Fetch symptom data for the selected date
  useEffect(() => {
    let active = true;
    const fetchSymptomForDate = async () => {
      setLoadingDate(true);
      try {
        const data = await getSymptomByDate(currentDate);
        if (active) {
          if (data) {
            setFormState({
              cramps: data.cramps || null,
              headache: data.headache || null,
              bloating: data.bloating || null,
              fatigue: data.fatigue || null,
              acne: data.acne || null,
              breast_tenderness: data.breast_tenderness || null,
              insomnia: data.insomnia || null,
              mood_swings: data.mood_swings || null,
              anxiety: data.anxiety || null,
              depressed: data.depressed || null,
              note: data.note || "",
            });
          } else {
            setFormState({
              cramps: null,
              headache: null,
              bloating: null,
              fatigue: null,
              acne: null,
              breast_tenderness: null,
              insomnia: null,
              mood_swings: null,
              anxiety: null,
              depressed: null,
              note: "",
            });
          }
        }
      } catch (err) {
        console.error("Error fetching symptom for date:", err);
      } finally {
        if (active) setLoadingDate(false);
      }
    };
    fetchSymptomForDate();
    return () => {
      active = false;
    };
  }, [currentDate]);

  const handleSeveritySelect = (symptomId, severity) => {
    setFormState((prev) => ({
      ...prev,
      [symptomId]: prev[symptomId] === severity ? null : severity,
    }));
  };

  const handleNoteChange = (e) => {
    setFormState((prev) => ({
      ...prev,
      note: e.target.value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccessMessage("");
    try {
      const payload = {
        date: currentDate,
        ...formState,
      };
      const success = await saveSymptom(payload);
      if (success) {
        setSuccessMessage("Gejala harian berhasil disimpan! 🌙");
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error saving symptoms:", error);
    } finally {
      setSaving(false);
    }
  };

  const handlePrevDay = () => {
    setCurrentDate((prev) => dayjs(prev).subtract(1, "day").format("YYYY-MM-DD"));
  };

  const handleNextDay = () => {
    setCurrentDate((prev) => dayjs(prev).add(1, "day").format("YYYY-MM-DD"));
  };

  const handleToday = () => {
    setCurrentDate(dayjs().format("YYYY-MM-DD"));
  };

  const renderSymptomCard = (symptom) => {
    const currentValue = formState[symptom.id];

    return (
      <div
        key={symptom.id}
        className="bg-white p-5 rounded-3xl border border-pink-100/40 shadow-xs flex flex-col justify-between hover:shadow-sm transition-all duration-200"
      >
        <div className="flex items-center gap-3.5 mb-4">
          <div className="text-3xl select-none">{symptom.emoji}</div>
          <span className="font-bold text-gray-700 text-sm">{symptom.label}</span>
        </div>

        <div className="flex gap-2">
          {/* Mild Button */}
          <button
            onClick={() => handleSeveritySelect(symptom.id, "mild")}
            className={`px-3 py-2 text-xs font-bold rounded-xl flex-1 transition-all duration-200 text-center ${
              currentValue === "mild"
                ? "bg-pink-500 text-white shadow-xs"
                : "bg-pink-50/50 text-pink-500 hover:bg-pink-100/70"
            }`}
          >
            Mild
          </button>

          {/* Moderate Button */}
          <button
            onClick={() => handleSeveritySelect(symptom.id, "mod")}
            className={`px-3 py-2 text-xs font-bold rounded-xl flex-1 transition-all duration-200 text-center ${
              currentValue === "mod"
                ? "bg-purple-500 text-white shadow-xs"
                : "bg-purple-50/50 text-purple-500 hover:bg-purple-100/70"
            }`}
          >
            Mod
          </button>

          {/* Severe Button */}
          <button
            onClick={() => handleSeveritySelect(symptom.id, "sev")}
            className={`px-3 py-2 text-xs font-bold rounded-xl flex-1 transition-all duration-200 text-center ${
              currentValue === "sev"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-indigo-50/50 text-indigo-500 hover:bg-indigo-100/70"
            }`}
          >
            Sev
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto pb-12 text-[#3B2F4A]">
      {/* HEADER */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 flex items-center gap-2">
            Pelacak Gejala Harian (Physical & Mental Symptoms)
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Catat apa yang Anda rasakan secara fisik dan mental untuk memantau siklus kesehatan secara menyeluruh.
          </p>
        </div>

        {/* DATE SELECTOR NAV */}
        <div className="flex items-center gap-2 self-start md:self-auto bg-white p-2.5 rounded-2xl border border-pink-100/60 shadow-3xs">
          <button
            onClick={handlePrevDay}
            className="p-1.5 hover:bg-pink-50 rounded-lg text-gray-500 hover:text-pink-500 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          
          <div className="flex items-center gap-1.5 px-2">
            <Calendar size={14} className="text-pink-400" />
            <input
              type="date"
              value={currentDate}
              onChange={(e) => e.target.value && setCurrentDate(e.target.value)}
              className="text-xs font-extrabold text-[#3B2F4A] bg-transparent border-none outline-none cursor-pointer"
            />
          </div>

          <button
            onClick={handleNextDay}
            className="p-1.5 hover:bg-pink-50 rounded-lg text-gray-500 hover:text-pink-500 transition-colors"
          >
            <ChevronRight size={16} />
          </button>

          <button
            onClick={handleToday}
            className="px-2.5 py-1.5 bg-pink-50 hover:bg-pink-100 text-pink-600 text-[10px] font-bold rounded-lg transition"
          >
            Hari Ini
          </button>
        </div>
      </div>

      {loadingDate ? (
        <div className="flex flex-col items-center justify-center p-20 bg-white rounded-[32px] border border-pink-100/40">
          <RefreshCw className="animate-spin text-pink-400 mb-3" size={24} />
          <p className="text-xs text-gray-400">Memuat data gejala...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* GEJALA FISIK */}
          <div>
            <h3 className="text-xs font-black text-pink-600 uppercase tracking-widest mb-4">
              GEJALA FISIK
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {PHYSICAL_SYMPTOMS.map(renderSymptomCard)}
            </div>
          </div>

          {/* GEJALA MENTAL */}
          <div>
            <h3 className="text-xs font-black text-purple-600 uppercase tracking-widest mb-4">
              GEJALA MENTAL & EMOSIONAL
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {MENTAL_SYMPTOMS.map(renderSymptomCard)}
            </div>
          </div>

          {/* NOTES AREA */}
          <div className="bg-white p-6 rounded-[28px] border border-pink-100/40 shadow-3xs space-y-3">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">
              CATATAN GEJALA TAMBAHAN
            </h3>
            <textarea
              value={formState.note}
              onChange={handleNoteChange}
              placeholder="Tuliskan keluhan atau catatan tambahan di sini..."
              rows={4}
              className="w-full p-4 rounded-2xl border border-gray-100 outline-none focus:border-[#E8B4D3] transition text-sm text-gray-600 bg-gray-50/20"
            />
          </div>

          {/* ACTION BAR */}
          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white font-bold px-8 py-4 rounded-2xl shadow-md flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer text-sm"
            >
              <Save size={16} />
              {saving ? "Menyimpan..." : "Simpan Catatan"}
            </button>

            {successMessage && (
              <span className="text-xs font-bold text-emerald-600 animate-fade-in bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-xl">
                {successMessage}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SymptomJournal;
