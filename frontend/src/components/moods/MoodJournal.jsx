import React, { useMemo } from "react";
import MoodPicker from "./MoodPicker";
import PhaseInsight from "./PhaseInsight";
import { 
  Trash2, Calendar, Heart, Smile, Activity, Sparkles, 
  TrendingUp, BarChart3, Quote 
} from "lucide-react";
import dayjs from "dayjs";

function MoodJournal({ 
  moods = [], 
  deleteMood, 
  todayMood, 
  getMoodEmoji, 
  MOOD_TYPES, 
  handleMoodSelect, 
  currentPhase, 
  phaseInfo 
}) {

  // 1. Calculate Mood Analytics
  const analytics = useMemo(() => {
    if (moods.length === 0) return null;

    // A. Find Dominant Mood
    const counts = {};
    moods.forEach(m => {
      counts[m.mood_type] = (counts[m.mood_type] || 0) + 1;
    });
    
    let dominantType = "";
    let dominantCount = 0;
    Object.entries(counts).forEach(([type, count]) => {
      if (count > dominantCount) {
        dominantCount = count;
        dominantType = type;
      }
    });

    const dominantEmoji = getMoodEmoji(dominantType);
    const dominantLabel = MOOD_TYPES.find(m => m.type === dominantType)?.label || dominantType;

    // B. Calculate Mood Stability Score
    const totalLogs = moods.length;
    const distinctTypes = Object.keys(counts).length;
    
    let stabilityScore = 100;
    let stabilityLabel = "Butuh Lebih Banyak Data 🌱";
    let stabilityColor = "text-gray-500";

    if (totalLogs >= 2) {
      // Formula: higher ratio of dominant mood to total logs = more stable
      stabilityScore = Math.round((dominantCount / totalLogs) * 100);
      
      if (stabilityScore >= 75) {
        stabilityLabel = "Sangat Stabil 🌸 (Emosimu tenang & teratur)";
        stabilityColor = "text-emerald-600";
      } else if (stabilityScore >= 45) {
        stabilityLabel = "Stabil Seimbang 💫 (Variasi emosi yang wajar)";
        stabilityColor = "text-purple-600";
      } else {
        stabilityLabel = "Fluktuatif 🌪️ (Normal karena pengaruh hormon PMS)";
        stabilityColor = "text-pink-500";
      }
    }

    // C. Get Positive Reflection Wall (last 3 positive logs with notes)
    const positiveMoods = ["happy", "loved", "energetic"];
    const positiveNotes = moods
      .filter(m => positiveMoods.includes(m.mood_type) && m.note && m.note.trim() !== "")
      .slice(-3) // last 3
      .reverse();

    return {
      dominantEmoji,
      dominantLabel,
      dominantCount,
      stabilityScore,
      stabilityLabel,
      stabilityColor,
      positiveNotes
    };
  }, [moods, getMoodEmoji, MOOD_TYPES]);

  // Handle delete past mood entry
  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus catatan mood ini?")) {
      await deleteMood(id);
    }
  };

  // Sort moods to show latest first
  const sortedMoods = useMemo(() => {
    return [...moods].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [moods]);

  return (
    <div className="mb-12 max-w-6xl mx-auto text-[#3B2F4A]">
      
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 flex items-center gap-2">
          Mood Journal & Wellness
        </h1>
        <p className="text-xs text-gray-500 mt-1">Catat suasana hatimu setiap hari untuk memantau pengaruh hormon terhadap kondisi emosional Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: MOOD PICKER & INSIGHTS (7 columns) */}
        <div className="lg:col-span-7 space-y-6">
          <MoodPicker 
            todayMood={todayMood} 
            getMoodEmoji={getMoodEmoji} 
            MOOD_TYPES={MOOD_TYPES} 
            handleMoodSelect={handleMoodSelect} 
          />

          <PhaseInsight 
            currentPhase={currentPhase} 
            phaseInfo={phaseInfo} 
          />
        </div>

        {/* RIGHT COLUMN: ANALYTICS & HISTORY (5 columns) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* MOOD ANALYTICS CARD */}
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-5 rounded-[28px] border border-purple-100/50 shadow-xs space-y-4">
            <h3 className="text-xs font-extrabold text-purple-700 uppercase tracking-wider flex items-center gap-1.5">
              <BarChart3 size={14} /> Analisis Suasana Hati
            </h3>

            {analytics ? (
              <div className="space-y-4">
                
                {/* stats row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-2xl border border-purple-100/40 text-center shadow-3xs">
                    <span className="text-[9px] text-gray-400 block font-medium">Dominan</span>
                    <span className="text-lg font-bold text-gray-800 flex items-center justify-center gap-1 mt-0.5">
                      <span>{analytics.dominantEmoji}</span>
                      <span className="text-xs truncate max-w-24">{analytics.dominantLabel}</span>
                    </span>
                  </div>
                  <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-2xl border border-purple-100/40 text-center shadow-3xs">
                    <span className="text-[9px] text-gray-400 block font-medium">Total Catatan</span>
                    <span className="text-lg font-black text-purple-600 mt-0.5 block">{moods.length} Kali</span>
                  </div>
                </div>

                {/* stability insight */}
                <div className="bg-white p-3.5 rounded-2xl border border-purple-100/40">
                  <span className="text-[9px] text-gray-400 block font-medium">Kestabilan Emosi</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`text-xs font-bold ${analytics.stabilityColor}`}>
                      {analytics.stabilityLabel}
                    </span>
                  </div>
                  {moods.length >= 2 && (
                    <div className="w-full bg-purple-100/35 h-1.5 rounded-full overflow-hidden mt-2">
                      <div 
                        className="bg-gradient-to-r from-pink-400 to-purple-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${analytics.stabilityScore}%` }}
                      ></div>
                    </div>
                  )}
                </div>

                {/* Positive wall */}
                {analytics.positiveNotes.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles size={11} className="text-amber-500" /> Dinding Refleksi Positif
                    </span>
                    <div className="space-y-2">
                      {analytics.positiveNotes.map(note => (
                        <div key={note.id} className="bg-white/90 p-3 rounded-xl border border-pink-100/40 text-[11px] leading-relaxed shadow-3xs text-gray-600 italic relative">
                          <Quote size={8} className="text-pink-300 absolute top-2 right-2 opacity-50" />
                          <p className="pr-4">"{note.note}"</p>
                          <span className="text-[8px] text-gray-400 block mt-1 font-semibold">{dayjs(note.date).format("D MMMM YYYY")}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div className="p-6 text-center text-xs text-gray-400 italic">
                Belum ada data untuk dianalisis. Silakan pilih mood Anda untuk hari ini terlebih dahulu!
              </div>
            )}
          </div>

          {/* MOOD HISTORY LOG CARD */}
          <div className="bg-white p-5 rounded-[28px] border border-pink-100 shadow-xs space-y-4">
            <h3 className="text-xs font-extrabold text-[#3B2F4A] uppercase tracking-wider flex items-center gap-1.5">
              <Calendar size={14} className="text-pink-400" /> Riwayat Jurnal Mood
            </h3>

            {sortedMoods.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400 italic">
                Belum ada riwayat mood yang dicatat.
              </div>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {sortedMoods.map((m) => {
                  const emoji = getMoodEmoji(m.mood_type);
                  const label = MOOD_TYPES.find(t => t.type === m.mood_type)?.label || m.mood_type;
                  const formattedDate = dayjs(m.date).format("dddd, D MMMM YYYY");

                  return (
                    <div 
                      key={m.id}
                      className="p-3 rounded-2xl bg-[#FCFAF8] border border-pink-100/30 flex items-start justify-between gap-3 group hover:border-pink-200 transition"
                    >
                      <div className="flex gap-2.5 items-start min-w-0">
                        <span className="text-2xl select-none pt-0.5">{emoji}</span>
                        <div className="min-w-0">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-xs font-bold text-gray-800">{label}</span>
                            <span className="text-[9px] text-gray-400 font-semibold">{formattedDate}</span>
                          </div>
                          {m.note && (
                            <p className="text-[11px] text-gray-500 mt-1 leading-normal break-words italic pr-2">
                              "{m.note}"
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {/* Delete button */}
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="text-gray-300 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition opacity-0 group-hover:opacity-100 self-center"
                        title="Hapus Catatan"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}

export default MoodJournal;
