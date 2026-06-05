import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import dayjs from "dayjs";
import { getHealthTips } from "../utils/reportFormatter";

const waitForImagesToLoad = async (element) => {
  const images = Array.from(element.querySelectorAll("img"));
  await Promise.all(
    images.map((img) =>
      img.complete
        ? Promise.resolve()
        : new Promise((resolve) => {
            const onFinish = () => {
              img.removeEventListener("load", onFinish);
              img.removeEventListener("error", onFinish);
              resolve();
            };
            img.addEventListener("load", onFinish);
            img.addEventListener("error", onFinish);
          })
    )
  );
};

const captureReportAsPDF = async (reportElement) => {
  const originalWidth = reportElement.style.width || "";
  const originalHeight = reportElement.style.height || "";
  reportElement.style.width = "900px";
  reportElement.style.minHeight = "auto";

  const canvas = await html2canvas(reportElement, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    allowTaint: false,
    imageTimeout: 30000,
    scrollX: -window.scrollX,
    scrollY: -window.scrollY,
  });

  reportElement.style.width = originalWidth;
  reportElement.style.height = originalHeight;

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pdfWidth;
  const imgHeight = (canvas.height * pdfWidth) / canvas.width;

  let position = 0;
  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);

  let heightLeft = imgHeight - pdfHeight;
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
    pdf.text(`Lunare  --  Halaman ${i} dari ${totalPages}`, pdfWidth / 2, pdfHeight - 10, {
      align: "center",
    });
  }

  pdf.save(`Laporan_Kesehatan_Lunare_${dayjs().format("YYYY-MM-DD")}.pdf`);
};

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

  await waitForImagesToLoad(reportElement);
  await new Promise((resolve) => setTimeout(resolve, 250));

  try {
    await captureReportAsPDF(reportElement);
  } catch (firstError) {
    const profileImage = reportElement.querySelector("img.pdf-profile-avatar");
    if (profileImage) {
      profileImage.style.display = "none";
      try {
        await captureReportAsPDF(reportElement);
      } finally {
        profileImage.style.display = "";
      }
    } else {
      throw firstError;
    }
  }
};
