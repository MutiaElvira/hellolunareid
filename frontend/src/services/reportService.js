import jsPDF from "jspdf";
import dayjs from "dayjs";
import { getHealthTips } from "../utils/reportFormatter";

export const generatePDFReport = async ({
  profile,
  periods,
  moods,
  prediction,
  avgCycleLength,
  avgDuration,
  nextPeriodDate,
  futurePredictions,
}) => {
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (needed) => {
    if (y + needed > pageHeight - margin) {
      pdf.addPage();
      y = margin;
    }
  };

  // Helper: draw a small colored circle as a bullet/icon
  const drawIcon = (x, cy, r, g, b, radius = 2.5) => {
    pdf.setFillColor(r, g, b);
    pdf.circle(x, cy, radius, "F");
  };

  // ── HEADER ──
  pdf.setFillColor(253, 242, 248);
  pdf.roundedRect(margin, y, contentWidth, 30, 4, 4, "F");

  // Decorative moon circle
  drawIcon(margin + 14, y + 12, 181, 126, 220, 5);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.setTextColor(255, 255, 255);
  pdf.text("L", margin + 12, y + 14);

  pdf.setFontSize(20);
  pdf.setTextColor(59, 47, 74);
  pdf.text("Lunare", margin + 24, y + 13);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(120, 100, 140);
  pdf.text("Wellness & Cycle Companion", margin + 24, y + 20);

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(107, 33, 168);
  pdf.text("Laporan Siklus Kesehatan", pageWidth - margin - 8, y + 12, { align: "right" });
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(140, 130, 150);
  pdf.text(`Dicetak: ${dayjs().format("DD MMMM YYYY, HH:mm")}`, pageWidth - margin - 8, y + 19, { align: "right" });
  y += 38;

  // ── USER INFO ──
  if (profile) {
    checkPageBreak(22);
    pdf.setFillColor(252, 231, 243);
    pdf.roundedRect(margin, y, contentWidth, 18, 3, 3, "F");
    pdf.setFontSize(8);
    pdf.setTextColor(140, 130, 150);
    pdf.setFont("helvetica", "bold");
    pdf.text("NAMA PENGGUNA", margin + 6, y + 7);
    pdf.text("EMAIL", margin + contentWidth / 2 + 6, y + 7);
    pdf.setFontSize(11);
    pdf.setTextColor(59, 47, 74);
    pdf.setFont("helvetica", "normal");
    pdf.text(profile.username || "-", margin + 6, y + 14);
    pdf.text(profile.email || "-", margin + contentWidth / 2 + 6, y + 14);
    y += 26;
  }

  // ── SECTION: RINGKASAN SIKLUS ──
  checkPageBreak(40);
  pdf.setDrawColor(243, 232, 255);
  pdf.setLineWidth(0.5);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 8;
  drawIcon(margin + 3, y + 2, 244, 114, 182);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(59, 47, 74);
  pdf.text("Ringkasan Siklus", margin + 9, y + 4);
  y += 14;

  const statBoxWidth = (contentWidth - 10) / 3;
  const stats = [
    { label: "Rata-rata Siklus", value: `${avgCycleLength} Hari` },
    { label: "Rata-rata Menstruasi", value: `${prediction?.has_data ? prediction.avg_period_duration : avgDuration} Hari` },
    { label: "Prediksi Berikutnya", value: nextPeriodDate },
  ];

  stats.forEach((stat, i) => {
    const x = margin + i * (statBoxWidth + 5);
    pdf.setFillColor(250, 248, 246);
    pdf.roundedRect(x, y, statBoxWidth, 22, 3, 3, "F");
    pdf.setDrawColor(243, 232, 255);
    pdf.roundedRect(x, y, statBoxWidth, 22, 3, 3, "S");
    pdf.setFontSize(7);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(140, 130, 150);
    pdf.text(stat.label.toUpperCase(), x + 5, y + 8);
    pdf.setFontSize(13);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(59, 47, 74);
    pdf.text(stat.value, x + 5, y + 17);
  });
  y += 32;

  // ── SECTION: RIWAYAT SIKLUS ──
  checkPageBreak(30);
  pdf.setDrawColor(243, 232, 255);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 8;
  drawIcon(margin + 3, y + 2, 167, 139, 250);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(59, 47, 74);
  pdf.text("Riwayat Siklus", margin + 9, y + 4);
  y += 12;

  if (periods.length === 0) {
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "italic");
    pdf.setTextColor(160, 160, 160);
    pdf.text("Belum ada riwayat menstruasi yang tercatat.", margin, y + 5);
    y += 14;
  } else {
    // Table header
    const colWidths = [12, contentWidth * 0.25, contentWidth * 0.25, contentWidth * 0.18, contentWidth * 0.32 - 12];
    const headers = ["No.", "Tanggal Mulai", "Tanggal Selesai", "Durasi", "Suasana Hati"];

    checkPageBreak(12);
    pdf.setFillColor(253, 242, 248);
    pdf.rect(margin, y, contentWidth, 10, "F");
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(181, 126, 220);

    let colX = margin;
    headers.forEach((h, i) => {
      pdf.text(h, colX + 3, y + 7);
      colX += colWidths[i];
    });
    y += 10;

    // Table rows
    const displayPeriods = periods.slice(0, 10);
    displayPeriods.forEach((p, idx) => {
      checkPageBreak(10);
      if (idx % 2 === 1) {
        pdf.setFillColor(250, 248, 246);
        pdf.rect(margin, y, contentWidth, 9, "F");
      }
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(80, 75, 90);

      colX = margin;
      const duration = dayjs(p.end_date).diff(dayjs(p.start_date), "day") + 1;
      const rowData = [
        `${idx + 1}`,
        dayjs(p.start_date).format("DD MMM YYYY"),
        dayjs(p.end_date).format("DD MMM YYYY"),
        `${duration} hari`,
        p.mood ? p.mood : "-",
      ];

      rowData.forEach((val, i) => {
        pdf.text(val, colX + 3, y + 6);
        colX += colWidths[i];
      });
      y += 9;
    });
    y += 8;
  }

  // ── SECTION: MOOD ANALYSIS ──
  checkPageBreak(30);
  pdf.setDrawColor(243, 232, 255);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 8;
  drawIcon(margin + 3, y + 2, 139, 92, 246);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(59, 47, 74);
  pdf.text("Analisis Suasana Hati", margin + 9, y + 4);
  y += 14;

  const moodCounts = {};
  let totalMoodsCount = 0;
  moods.forEach((m) => {
    moodCounts[m.mood_type] = (moodCounts[m.mood_type] || 0) + 1;
    totalMoodsCount++;
  });

  if (totalMoodsCount === 0) {
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "italic");
    pdf.setTextColor(160, 160, 160);
    pdf.text("Belum ada jurnal suasana hati.", margin, y + 5);
    y += 14;
  } else {
    // Mood bars
    Object.entries(moodCounts).forEach(([type, count]) => {
      checkPageBreak(12);
      const percentage = Math.round((count / totalMoodsCount) * 100);
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(80, 75, 90);
      pdf.text(type, margin + 4, y + 5);

      // Bar background
      const barX = margin + 40;
      const barWidth = contentWidth - 65;
      pdf.setFillColor(243, 232, 255);
      pdf.roundedRect(barX, y + 1, barWidth, 5, 2, 2, "F");

      // Bar fill (gradient effect with pink)
      const fillWidth = Math.max(barWidth * (percentage / 100), 1);
      pdf.setFillColor(244, 114, 182);
      pdf.roundedRect(barX, y + 1, fillWidth, 5, 2, 2, "F");

      pdf.setFontSize(8);
      pdf.setFont("helvetica", "bold");
      pdf.text(`${percentage}%`, pageWidth - margin - 3, y + 5, { align: "right" });
      y += 10;
    });
    y += 6;
  }

  // ── SECTION: RECENT NOTES ──
  const recentNotes = moods.filter(m => m.note).slice(0, 3);
  if (recentNotes.length > 0) {
    checkPageBreak(25);
    drawIcon(margin + 3, y + 2, 196, 181, 253);
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(107, 33, 168);
    pdf.text("Catatan Jurnal Terbaru", margin + 9, y + 4);
    y += 12;

    recentNotes.forEach((m) => {
      checkPageBreak(16);
      pdf.setFillColor(250, 248, 246);
      pdf.roundedRect(margin, y, contentWidth, 14, 3, 3, "F");
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(140, 130, 150);
      pdf.text(`${m.mood_type}  --  ${dayjs(m.date).format("DD MMM YYYY")}`, margin + 5, y + 5);
      pdf.setFont("helvetica", "italic");
      pdf.setTextColor(100, 90, 110);
      const noteText = pdf.splitTextToSize(`"${m.note}"`, contentWidth - 12);
      pdf.text(noteText[0], margin + 5, y + 11);
      y += 16;
    });
    y += 4;
  }

  // ── SECTION: PREDIKSI 1 TAHUN KEDEPAN ──
  if (futurePredictions && futurePredictions.length > 0) {
    checkPageBreak(40);
    pdf.setDrawColor(243, 232, 255);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 8;
    drawIcon(margin + 3, y + 2, 52, 211, 153);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(59, 47, 74);
    pdf.text("Prediksi 1 Tahun (12 Siklus)", margin + 9, y + 4);
    y += 12;

    pdf.setFillColor(253, 242, 248);
    pdf.rect(margin, y, contentWidth, 10, "F");
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(181, 126, 220);
    
    // 3 columns for 12 months
    const colW = contentWidth / 3;
    pdf.text("Siklus 1 - 4", margin + 5, y + 7);
    pdf.text("Siklus 5 - 8", margin + colW + 5, y + 7);
    pdf.text("Siklus 9 - 12", margin + colW * 2 + 5, y + 7);
    y += 10;

    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(80, 75, 90);

    for (let i = 0; i < 4; i++) {
      checkPageBreak(8);
      if (i % 2 === 1) {
        pdf.setFillColor(250, 248, 246);
        pdf.rect(margin, y, contentWidth, 8, "F");
      }
      for (let j = 0; j < 3; j++) {
        const idx = j * 4 + i;
        if (idx < futurePredictions.length) {
          const d = dayjs(futurePredictions[idx]).format("DD MMM YYYY");
          pdf.setFont("helvetica", "bold");
          pdf.text(`${idx + 1}.`, margin + j * colW + 5, y + 5.5);
          pdf.setFont("helvetica", "normal");
          pdf.text(d, margin + j * colW + 15, y + 5.5);
        }
      }
      y += 8;
    }
    y += 8;
  }

  // ── SECTION: TIPS ──
  checkPageBreak(30);
  pdf.setDrawColor(243, 232, 255);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 6;
  pdf.setFillColor(253, 242, 248);
  pdf.roundedRect(margin, y, contentWidth, 24, 4, 4, "F");
  drawIcon(margin + 9, y + 6, 251, 191, 36, 3);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(59, 47, 74);
  pdf.text("Tips Kesehatan Lunare", margin + 15, y + 8);

  pdf.setFontSize(8);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(100, 90, 110);
  
  const tipText = getHealthTips(prediction);
  
  const tipLines = pdf.splitTextToSize(tipText, contentWidth - 14);
  pdf.text(tipLines, margin + 6, y + 16);

  // ── FOOTER ──
  const totalPages = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(7);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(180, 175, 190);
    pdf.text(
      `Lunare  --  Halaman ${i} dari ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
  }

  pdf.save(`Laporan_Kesehatan_Lunare_${dayjs().format("YYYY-MM-DD")}.pdf`);
};
