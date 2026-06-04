import { useState } from "react";
import { FaDownload } from "react-icons/fa";
import { generatePDFReport } from "../../services/reportService";
import ReportPreview from "./ReportPreview";

function HealthReport({
  profile,
  periods,
  symptoms,
  prediction,
  avgCycleLength,
  avgDuration,
  nextPeriodDate,
  futurePredictions,
  showAlert,
}) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownloadPDF = async () => {
    setIsGeneratingPdf(true);
    try {
      await generatePDFReport({
        profile,
        periods,
        symptoms,
        prediction,
        avgCycleLength,
        avgDuration,
        nextPeriodDate,
        futurePredictions,
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      showAlert("Gagal Mengunduh PDF", "Terjadi kesalahan saat mengunduh PDF. Silakan coba lagi.", "error");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <>
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Laporan Kesehatan</h1>
          <p className="text-gray-500">Unduh rangkuman siklus dan gejala kesehatan Anda</p>
        </div>
        <button
          onClick={handleDownloadPDF}
          disabled={isGeneratingPdf}
          className="bg-gradient-to-r from-pink-300 to-purple-300 hover:from-pink-400 hover:to-purple-400 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold px-6 py-4 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md self-start md:self-auto cursor-pointer"
        >
          <FaDownload />
          {isGeneratingPdf ? "Membuat PDF..." : "Unduh Laporan (PDF)"}
        </button>
      </div>

      <ReportPreview
        profile={profile}
        periods={periods}
        symptoms={symptoms}
        prediction={prediction}
        avgCycleLength={avgCycleLength}
      />
    </>
  );
}

export default HealthReport;
