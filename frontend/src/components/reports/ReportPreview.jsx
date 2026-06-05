import dayjs from "dayjs";
import { API_BASE_URL } from "../../services/api";
import { formatReportDateTime, calculateSymptomDistribution, getRecentNotes, getHealthTips, SYMPTOM_LABELS } from "../../utils/reportFormatter";

function ReportPreview({ profile, periods, symptoms, prediction, avgCycleLength }) {
  const profileImageUrl = profile?.profile_picture
    ? profile.profile_picture.startsWith("http") || profile.profile_picture.startsWith("data:image/")
      ? profile.profile_picture
      : `${API_BASE_URL}${profile.profile_picture}`
    : null;

  const { symptomCounts, totalLogs } = calculateSymptomDistribution(symptoms);
  const recentNotes = getRecentNotes(symptoms, 3);
  const healthTips = getHealthTips(prediction);

  return (
    <div className="bg-white border border-pink-100 rounded-[32px] shadow-sm overflow-hidden p-6 md:p-10 mb-8 max-w-4xl mx-auto">
      <div id="pdf-report-content" className="pdf-container p-6 rounded-2xl">
        {/* Header */}
        <div className="pdf-header-gradient p-8 rounded-2xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="pdf-logo-wrapper">
              <img src="/moon-logo.svg" alt="Logo Lunare" className="pdf-logo" />
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
          <div className="mb-8 bg-pink-50/50 p-6 rounded-2xl border border-pink-100 flex flex-col md:flex-row md:justify-between gap-4 items-center">
            <div className="flex items-center gap-4">
              <div className="pdf-profile-avatar-wrapper">
                {profileImageUrl ? (
                  <img
                    src={profileImageUrl}
                    alt="Profile"
                    className="pdf-profile-avatar"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div className="pdf-profile-avatar pdf-profile-avatar-fallback">
                    {profile.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Nama Pengguna</p>
                <p className="text-lg font-bold text-gray-700">{profile.username}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Email</p>
              <p className="text-lg font-medium text-gray-700">{profile.email}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
          <div className="pdf-highlight-card">
            <span className="pdf-label">Rata-rata Siklus</span>
            <p className="pdf-value">{avgCycleLength} Hari</p>
            <p className="text-xs text-gray-500 mt-3">Memperlihatkan panjang rata-rata siklus menstruasi.</p>
          </div>
          <div className="pdf-highlight-card">
            <span className="pdf-label">Rata-rata Menstruasi</span>
            <p className="pdf-value">{prediction?.has_data ? prediction.avg_period_duration : 5} Hari</p>
            <p className="text-xs text-gray-500 mt-3">Durasi rata-rata periode menstruasi.</p>
          </div>
          <div className="pdf-highlight-card">
            <span className="pdf-label">Prediksi Berikutnya</span>
            <p className="pdf-value">{prediction?.has_data ? dayjs(prediction.next_period_date).format("DD MMM YYYY") : "Belum Tersedia"}</p>
            <p className="text-xs text-gray-500 mt-3">Tanggal menstruasi berikutnya berdasarkan data terakhir.</p>
          </div>
          <div className="pdf-highlight-card">
            <span className="pdf-label">Total Catatan</span>
            <p className="pdf-value">{totalLogs}</p>
            <p className="text-xs text-gray-500 mt-3">Jumlah entri gejala harian yang tercatat.</p>
          </div>
        </div>

        <div className="pdf-infobox mb-8">
          <p className="font-semibold text-sm text-[#4C1D95] mb-2">Ringkasan Singkat</p>
          <p className="text-xs text-[#5B21B6] leading-relaxed">
            Laporan ini menampilkan informasi terpilih tentang siklus dan gejala kesehatan Anda, termasuk riwayat menstruasi, frekuensi gejala, serta prediksi siklus berikutnya.
          </p>
        </div>

        <h3 className="pdf-section-title text-xl font-bold mb-4 text-[#3B2F4A] flex items-center gap-2">
          <span>📊</span> Ringkasan Siklus
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="pdf-stat-card">
            <p className="text-xs text-purple-700 font-bold uppercase tracking-wider mb-1">Rata-rata Siklus</p>
            <p className="text-2xl font-bold text-[#3B2F4A]">{avgCycleLength} Hari</p>
          </div>
          <div className="pdf-stat-card">
            <p className="text-xs text-purple-700 font-bold uppercase tracking-wider mb-1">Rata-rata Menstruasi</p>
            <p className="text-2xl font-bold text-[#3B2F4A]">{prediction?.has_data ? prediction.avg_period_duration : 5} Hari</p>
          </div>
          <div className="pdf-stat-card">
            <p className="text-xs text-purple-700 font-bold uppercase tracking-wider mb-1">Prediksi Berikutnya</p>
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

        {/* Symptoms Section */}
        <h3 className="text-xl font-bold mb-4 text-[#3B2F4A] flex items-center gap-2 border-b border-pink-100 pb-2">
          <span>🧠</span> Ringkasan Gejala Harian
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Symptom distribution */}
          <div className="pdf-stat-card">
            <h4 className="font-bold text-sm text-purple-700 mb-3">Frekuensi Gejala Terdeteksi</h4>
            {totalLogs === 0 ? (
              <p className="text-gray-400 text-xs italic">Belum ada catatan gejala harian.</p>
            ) : (
              <div className="space-y-2.5">
                {Object.entries(symptomCounts).map(([key, count]) => {
                  const percentage = Math.round((count / symptoms.length) * 100);
                  const label = SYMPTOM_LABELS[key] || key;
                  return (
                    <div key={key} className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-gray-700">{label}</span>
                      <div className="flex items-center gap-2 w-1/2">
                        <div className="bg-pink-100 h-2.5 rounded-full flex-1 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-pink-300 to-purple-300 h-2.5 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-gray-500 w-12 text-right">{count} kali</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Symptom notes */}
          <div className="pdf-stat-card">
            <h4 className="font-bold text-sm text-purple-700 mb-3">Catatan Keluhan Terbaru</h4>
            {recentNotes.length === 0 ? (
              <p className="text-gray-400 text-xs italic">Tidak ada catatan keluhan terbaru.</p>
            ) : (
              <div className="space-y-2.5">
                {recentNotes.map((s) => (
                  <div key={s.id} className="text-xs bg-white p-2.5 rounded-xl border border-pink-50 shadow-sm">
                    <div className="flex justify-between text-gray-400 mb-1 font-semibold">
                      <span>Keluhan Tambahan</span>
                      <span>{dayjs(s.date).format("DD MMM YYYY")}</span>
                    </div>
                    <p className="text-gray-600 italic">"{s.note}"</p>
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
