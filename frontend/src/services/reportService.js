import jsPDF from "jspdf";
import dayjs from "dayjs";
import { API_BASE_URL } from "./api";

const normalizeImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith("http") || imageUrl.startsWith("data:image/")) {
    return imageUrl;
  }
  return `${API_BASE_URL}${imageUrl}`;
};

const fetchImageDataUrl = async (imageUrl) => {
  if (!imageUrl) return null;
  try {
    const response = await fetch(imageUrl, { mode: "cors", cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Image request failed with status ${response.status}`);
    }
    const blob = await response.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.warn("Unable to load profile image for PDF:", error);
    return null;
  }
};

const addPageFooter = (pdf, pageNumber, totalPages, width, height) => {
  pdf.setFontSize(7);
  pdf.setTextColor(140, 136, 160);
  pdf.text(`Lunare — Halaman ${pageNumber} dari ${totalPages}`, width / 2, height - 10, {
    align: "center",
  });
};

const addReportHeader = (pdf, pageWidth, margin) => {
  pdf.setFontSize(18);
  pdf.setTextColor(59, 47, 74);
  pdf.text("Lunare", margin, 20);

  pdf.setFontSize(9);
  pdf.setTextColor(120, 113, 145);
  pdf.text("Wellness & Cycle Companion", margin, 26);

  pdf.setFontSize(10);
  pdf.setTextColor(99, 102, 241);
  pdf.text(`Dicetak pada: ${dayjs().format("DD MMMM YYYY, HH:mm")}`, pageWidth - margin, 20, {
    align: "right",
  });
};

const drawSectionTitle = (pdf, text, x, y) => {
  pdf.setFontSize(13);
  pdf.setTextColor(59, 47, 74);
  pdf.setFont("helvetica", "bold");
  pdf.text(text, x, y);
};

const drawCard = (pdf, x, y, width, height, label, value) => {
  pdf.setFillColor(248, 227, 255);
  pdf.roundedRect(x, y, width, height, 6, 6, "F");
  pdf.setFontSize(8);
  pdf.setTextColor(120, 113, 145);
  pdf.setFont("helvetica", "bold");
  pdf.text(label, x + 3, y + 6);
  pdf.setFontSize(14);
  pdf.setTextColor(59, 47, 74);
  pdf.setFont("helvetica", "bold");
  pdf.text(value, x + 3, y + 16);
};

const drawPeriodsTable = (pdf, periods, x, y, maxWidth) => {
  const rowHeight = 7;
  const columnWidths = [14, 40, 40, 30, 50];
  const startX = x;
  let currentY = y;

  pdf.setFontSize(9);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(59, 47, 74);
  ["No", "Mulai", "Selesai", "Durasi", "Mood"].forEach((header, index) => {
    pdf.text(header, startX + 2 + columnWidths.slice(0, index).reduce((sum, w) => sum + w, 0), currentY);
  });

  currentY += 5;
  pdf.setLineWidth(0.2);
  pdf.setDrawColor(229, 214, 235);
  pdf.line(startX, currentY, startX + maxWidth, currentY);
  currentY += 2;

  pdf.setFontSize(8);
  pdf.setFont("helvetica", "normal");
  const rows = periods.slice(0, 8);
  rows.forEach((period, index) => {
    const rowY = currentY + index * rowHeight;
    const duration = dayjs(period.end_date).diff(dayjs(period.start_date), "day") + 1;
    const values = [String(index + 1), dayjs(period.start_date).format("DD MMM YYYY"), dayjs(period.end_date).format("DD MMM YYYY"), `${duration} hari`, period.mood || "-"];
    values.forEach((value, colIndex) => {
      pdf.text(value, startX + 2 + columnWidths.slice(0, colIndex).reduce((sum, w) => sum + w, 0), rowY);
    });
  });

  return rows.length * rowHeight + 8;
};

const drawSymptomSummary = (pdf, symptoms, x, y) => {
  const symptomCounts = {};
  symptoms.forEach((entry) => {
    Object.keys(entry).forEach((key) => {
      if (key !== "id" && key !== "date" && key !== "note" && key !== "mood" && entry[key]) {
        symptomCounts[key] = (symptomCounts[key] || 0) + 1;
      }
    });
  });

  const lines = Object.entries(symptomCounts).map(([key, count]) => `${key}: ${count} kali`);
  if (lines.length === 0) {
    pdf.setFontSize(9);
    pdf.setTextColor(120, 113, 145);
    pdf.text("Belum ada catatan gejala harian.", x, y);
    return 8;
  }

  pdf.setFontSize(9);
  pdf.setTextColor(59, 47, 74);
  lines.forEach((line, index) => {
    pdf.text(`- ${line}`, x, y + index * 6);
  });

  return lines.length * 6;
};

export const generatePDFReport = async ({
  profile,
  periods = [],
  symptoms = [],
  prediction,
  avgCycleLength,
}) => {
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const profileImageUrl = normalizeImageUrl(profile?.profile_picture);
  const profileImageDataUrl = await fetchImageDataUrl(profileImageUrl);

  addReportHeader(pdf, pageWidth, margin);

  let currentY = 35;

  pdf.setFillColor(253, 241, 255);
  pdf.roundedRect(margin, currentY, contentWidth, 30, 8, 8, "F");
  if (profileImageDataUrl) {
    pdf.addImage(profileImageDataUrl, "PNG", margin + 4, currentY + 4, 26, 26);
  } else {
    pdf.setFillColor(237, 219, 255);
    pdf.circle(margin + 17, currentY + 17, 13, "F");
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(99, 102, 241);
    pdf.text((profile?.username?.charAt(0) || "U").toUpperCase(), margin + 17, currentY + 18, {
      align: "center",
      baseline: "middle",
    });
  }

  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(59, 47, 74);
  pdf.text(profile?.username || "Pengguna", margin + 36, currentY + 11);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(101, 113, 133);
  pdf.text(profile?.email || "Tidak tersedia", margin + 36, currentY + 18);

  currentY += 40;

  const cardWidth = (contentWidth - 10) / 2;
  const cardHeight = 22;
  const highlights = [
    { label: "Rata-rata Siklus", value: `${avgCycleLength || 0} Hari` },
    { label: "Rata-rata Menstruasi", value: `${prediction?.has_data ? prediction.avg_period_duration : 5} Hari` },
    { label: "Prediksi Berikutnya", value: prediction?.has_data ? dayjs(prediction.next_period_date).format("DD MMM YYYY") : "Belum Tersedia" },
    { label: "Total Catatan", value: `${symptoms.length || 0}` },
  ];

  highlights.forEach((highlight, index) => {
    const row = Math.floor(index / 2);
    const col = index % 2;
    const x = margin + col * (cardWidth + 10);
    const y = currentY + row * (cardHeight + 8);
    drawCard(pdf, x, y, cardWidth, cardHeight, highlight.label, highlight.value);
  });

  currentY += cardHeight * 2 + 14;

  drawSectionTitle(pdf, "Ringkasan Siklus", margin, currentY);
  currentY += 8;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(120, 113, 145);
  pdf.text(`Berikut ringkasan data siklus dan kesehatan Anda saat ini.`, margin, currentY);
  currentY += 12;

  drawSectionTitle(pdf, "Riwayat Siklus", margin, currentY);
  currentY += 8;

  if (periods.length === 0) {
    pdf.setFontSize(9);
    pdf.setTextColor(120, 113, 145);
    pdf.text("Belum ada riwayat menstruasi yang tercatat.", margin, currentY);
    currentY += 10;
  } else {
    currentY += drawPeriodsTable(pdf, periods, margin, currentY, contentWidth);
    currentY += 6;
  }

  if (currentY + 70 > pageHeight - margin) {
    pdf.addPage();
    currentY = margin;
  }

  drawSectionTitle(pdf, "Ringkasan Gejala", margin, currentY);
  currentY += 8;

  const symptomBlockHeight = drawSymptomSummary(pdf, symptoms, margin, currentY);
  currentY += symptomBlockHeight + 10;

  if (currentY + 40 > pageHeight - margin) {
    pdf.addPage();
    currentY = margin;
  }

  pdf.setFillColor(250, 244, 255);
  pdf.roundedRect(margin, currentY, contentWidth, 28, 6, 6, "F");
  pdf.setFontSize(10);
  pdf.setTextColor(79, 70, 229);
  pdf.setFont("helvetica", "bold");
  pdf.text("Tips Kesehatan Lunare", margin + 4, currentY + 8);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(101, 113, 133);
  const tips = prediction?.has_data
    ? prediction.avg_cycle_length < 21 || prediction.avg_cycle_length > 35
      ? "Siklus menstruasi Anda terdeteksi di luar rentang normal (21-35 hari). Pertahankan gaya hidup sehat dan konsultasikan jika pola ini berlanjut."
      : "Siklus Anda berada di rentang normal (21-35 hari). Jaga hidrasi, nutrisi, dan manajemen stres untuk stabilitas hormonal."
    : "Catat terus data menstruasi Anda untuk mendapatkan analisis siklus dan prediksi yang akurat dari Lunare.";
  pdf.text(tips, margin + 4, currentY + 14, { maxWidth: contentWidth - 8 });

  const totalPages = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i += 1) {
    pdf.setPage(i);
    addPageFooter(pdf, i, totalPages, pageWidth, pageHeight);
  }

  pdf.save(`Laporan_Kesehatan_Lunare_${dayjs().format("YYYY-MM-DD")}.pdf`);
};
