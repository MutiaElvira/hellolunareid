import dayjs from "dayjs";
import { formatReportDateTime, calculateMoodDistribution, getRecentNotes, getHealthTips } from "../../utils/reportFormatter";

function ReportPreview({ profile, periods, moods, prediction, avgCycleLength, getMoodEmoji }) {
  const { moodCounts, totalMoodsCount } = calculateMoodDistribution(moods);
  const recentNotes = getRecentNotes(moods, 3);
  const healthTips = getHealthTips(prediction);

  return (
    <div className="bg-white border border-pink-100 rounded-[32px] shadow-sm overflow-hidden p-6 md:p-10 mb-8 max-w-4xl mx-auto">
      <div id="pdf-report-content" className="pdf-container p-6 rounded-2xl">
        {/* Header */}
        <div className="pdf-header-gradient p-8 rounded-2xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white p-3 rounded-full shadow-sm">
              <span className="text-pink-400 text-3xl">🌙</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#3B2F4A]">Lunare</h2>
              <p className="text-xs text-gray-500">Wellness & Cycle Companion</p>
            </div>
          </div>
          <div className="text-left md:text-right">
            <h3 className="text-lg font-bold text-purple-700">Laporan Siklus Kesehatan</h3>
            <p className="text-xs text-gray-500 mt-1">Dicetak pada: {formatReportDateTime(new Date())}</p>
          </div>
        </div>

        {/* Profile info */}
        {profile && (
          <div className="mb-8 bg-pink-50/50 p-6 rounded-2xl border border-pink-100 flex flex-col md:flex-row md:justify-between gap-4">
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Nama Pengguna</p>
              <p className="text-lg font-bold text-gray-700">{profile.username}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Email</p>
              <p className="text-lg font-medium text-gray-700">{profile.email}</p>
            </div>
          </div>
        )}

        {/* Summary / Stats Grid */}
        <h3 className="text-xl font-bold mb-4 text-[#3B2F4A] flex items-center gap-2 border-b border-pink-100 pb-2">
          <span>📊</span> Ringkasan Siklus
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="pdf-stat-card">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Rata-rata Siklus</p>
            <p className="text-2xl font-bold text-[#3B2F4A]">{avgCycleLength} Hari</p>
          </div>
          <div className="pdf-stat-card">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Rata-rata Menstruasi</p>
            <p className="text-2xl font-bold text-[#3B2F4A]">{prediction?.has_data ? prediction.avg_period_duration : 5} Hari</p>
          </div>
          <div className="pdf-stat-card">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Prediksi Berikutnya</p>
            <p className="text-2xl font-bold text-[#3B2F4A]">
              {prediction?.has_data ? dayjs(prediction.next_period_date).format("DD MMM YYYY") : "No Data"}
            </p>
          </div>
        </div>

        {/* Period History */}
        <h3 className="text-xl font-bold mb-4 text-[#3B2F4A] flex items-center gap-2 border-b border-pink-100 pb-2">
          <span>📅</span> Riwayat Siklus
        </h3>
        {periods.length === 0 ? (
          <p className="text-gray-400 text-sm italic mb-8">Belum ada riwayat menstruasi yang tercatat.</p>
        ) : (
          <div className="overflow-x-auto mb-8 rounded-xl border border-pink-100">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-pink-50/50">
                  <th className="pdf-table-header">No.</th>
                  <th className="pdf-table-header">Tanggal Mulai</th>
                  <th className="pdf-table-header">Tanggal Selesai</th>
                  <th className="pdf-table-header">Durasi</th>
                  <th className="pdf-table-header">Suasana Hati</th>
                </tr>
              </thead>
              <tbody>
                {periods.slice(0, 10).map((p, idx) => (
                  <tr key={p.id} className="pdf-table-row">
                    <td className="p-3 text-gray-600 font-semibold">{idx + 1}</td>
                    <td className="p-3 text-gray-700">{dayjs(p.start_date).format("DD MMM YYYY")}</td>
                    <td className="p-3 text-gray-700">{dayjs(p.end_date).format("DD MMM YYYY")}</td>
                    <td className="p-3 text-gray-700">
                      {dayjs(p.end_date).diff(dayjs(p.start_date), "day") + 1} hari
                    </td>
                    <td className="p-3 text-gray-700 capitalize">{p.mood ? p.mood : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Moods Section */}
        <h3 className="text-xl font-bold mb-4 text-[#3B2F4A] flex items-center gap-2 border-b border-pink-100 pb-2">
          <span>🧠</span> Analisis Jurnal Suasana Hati
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Mood count */}
          <div className="pdf-stat-card">
            <h4 className="font-bold text-sm text-purple-700 mb-3">Distribusi Suasana Hati</h4>
            {totalMoodsCount === 0 ? (
              <p className="text-gray-400 text-xs italic">Belum ada jurnal suasana hati.</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(moodCounts).map(([type, count]) => {
                  const percentage = Math.round((count / totalMoodsCount) * 100);
                  return (
                    <div key={type} className="flex items-center justify-between text-xs">
                      <span className="capitalize flex items-center gap-1.5 font-medium">
                        <span>{getMoodEmoji(type)}</span>
                        <span>{type}</span>
                      </span>
                      <div className="flex items-center gap-2 w-1/2">
                        <div className="bg-pink-100 h-2.5 rounded-full flex-1 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-pink-300 to-purple-300 h-2.5 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-gray-500 w-8 text-right">{percentage}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Mood notes */}
          <div className="pdf-stat-card">
            <h4 className="font-bold text-sm text-purple-700 mb-3">Catatan Jurnal Terbaru</h4>
            {recentNotes.length === 0 ? (
              <p className="text-gray-400 text-xs italic">Tidak ada catatan suasana hati terbaru.</p>
            ) : (
              <div className="space-y-2.5">
                {recentNotes.map((m) => (
                  <div key={m.id} className="text-xs bg-white p-2.5 rounded-xl border border-pink-50 shadow-sm">
                    <div className="flex justify-between text-gray-400 mb-1">
                      <span className="font-bold flex items-center gap-1">
                        <span>{getMoodEmoji(m.mood_type)}</span>
                        <span className="capitalize">{m.mood_type}</span>
                      </span>
                      <span>{dayjs(m.date).format("DD MMM YYYY")}</span>
                    </div>
                    <p className="text-gray-600 italic">"{m.note}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Health Insights */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-2xl border border-pink-100/50">
          <h4 className="font-bold text-[#3B2F4A] mb-2 flex items-center gap-1.5">
            <span>💡</span> Tips Kesehatan Lunare
          </h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            {healthTips}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ReportPreview;
