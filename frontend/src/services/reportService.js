import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import dayjs from "dayjs";
import { getHealthTips } from "../utils/reportFormatter";

export const generatePDFReport = async ({
  profile,
  periods,
  symptoms,
  prediction,
  avgCycleLength,
  avgDuration,
  nextPeriodDate,
  futurePredictions,
}) => {
  const reportElement = document.getElementById("pdf-report-content");
  if (!reportElement) {
    throw new Error("Tidak dapat menemukan elemen laporan untuk diunduh.");
  }

  const originalWidth = reportElement.style.width;
  reportElement.style.width = "900px";

  const canvas = await html2canvas(reportElement, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    allowTaint: false,
    imageTimeout: 15000,
  });

  reportElement.style.width = originalWidth;

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgProps = { width: canvas.width, height: canvas.height };
  const imgWidth = pdfWidth;
  const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pdfHeight;

  while (heightLeft > -0.1) {
    position -= pdfHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
  }

  const totalPages = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(7);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(180, 175, 190);
    pdf.text(`Lunare  --  Halaman ${i} dari ${totalPages}`, pdfWidth / 2, pdfHeight - 10, { align: "center" });
  }

  pdf.save(`Laporan_Kesehatan_Lunare_${dayjs().format("YYYY-MM-DD")}.pdf`);
};
