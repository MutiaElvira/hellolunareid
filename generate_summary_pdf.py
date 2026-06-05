import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            super().showPage()
        super().save()

    def draw_page_number(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#9CA3AF"))
        
        # Header (Top of Page)
        self.setStrokeColor(colors.HexColor("#E5E7EB"))
        self.setLineWidth(0.5)
        self.line(54, 750, 558, 750)
        self.drawString(54, 755, "Dokumentasi Perjalanan Lunare")
        
        # Footer (Bottom of Page)
        self.line(54, 45, 558, 45)
        page_text = f"Halaman {self._pageNumber} dari {page_count}"
        self.drawRightString(558, 32, page_text)
        self.drawString(54, 32, "Lunare -- Smart Period & Cycle Companion")
        self.restoreState()

def build_pdf(filename="Dokumentasi_Perjalanan_Lunare.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        rightMargin=54,
        leftMargin=54,
        topMargin=72,
        bottomMargin=72
    )

    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#B57EDC'), # Lunare Purple
        alignment=1,
        spaceAfter=10
    )

    subtitle_style = ParagraphStyle(
        'DocSub',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=10,
        leading=12,
        textColor=colors.HexColor('#E8B4D3'), # Lunare Pink
        alignment=1,
        spaceAfter=25
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=colors.HexColor('#3B2F4A'),
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['BodyText'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor('#374151'),
        spaceAfter=8
    )

    bold_body_style = ParagraphStyle(
        'DocBoldBody',
        parent=body_style,
        fontName='Helvetica-Bold',
    )

    bullet_style = ParagraphStyle(
        'DocBullet',
        parent=body_style,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=4
    )

    tip_style = ParagraphStyle(
        'DocTip',
        parent=body_style,
        fontName='Helvetica-Oblique',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor('#047857') # Emerald Green
    )

    story = []

    # Title & Subtitle
    story.append(Paragraph("DOKUMENTASI PERJALANAN LUNARE", title_style))
    story.append(Paragraph("Rangkuman Pengembangan & Langkah Deployment Full-Stack", subtitle_style))
    story.append(Spacer(1, 10))

    # SECTION 1: RINGKASAN PROYEK
    story.append(Paragraph("1. Ringkasan Proyek", h1_style))
    story.append(Paragraph(
        "<b>Lunare</b> adalah aplikasi web modern pelacak siklus menstruasi dan kesehatan fisik & mental (wellness companion). "
        "Aplikasi ini dibangun menggunakan arsitektur monorepo yang memisahkan frontend dan backend secara bersih:",
        body_style
    ))
    story.append(Paragraph("• <b>Backend</b>: Menggunakan framework <b>FastAPI</b> (Python) yang sangat cepat dan terdokumentasi otomatis dengan OpenAPI/Swagger.", bullet_style))
    story.append(Paragraph("• <b>Frontend</b>: Menggunakan library <b>React</b> dengan build-tool <b>Vite</b> dan styling <b>Tailwind CSS</b> untuk antarmuka yang modern, responsif, dan dinamis.", bullet_style))
    story.append(Paragraph("• <b>Database</b>: Menggunakan database relational <b>PostgreSQL</b> yang di-host di layanan cloud <b>Supabase</b>.", bullet_style))
    story.append(Spacer(1, 10))

    # SECTION 2: PERJALANAN & LANGKAH-LANGKAH DEPLOYMENT
    story.append(Paragraph("2. Langkah-Langkah Deployment Online", h1_style))
    story.append(Paragraph(
        "Berikut adalah urutan langkah logis yang dilakukan dari memindahkan kode lokal hingga aplikasi dapat diakses secara online dari perangkat HP:",
        body_style
    ))
    
    # Git
    story.append(Paragraph("<b>Langkah 1: Inisialisasi Git & Upload ke GitHub</b>", bold_body_style))
    story.append(Paragraph(
        "Sebelum dideploy, kode lokal diorganisir menggunakan Git. File sensitif seperti file konfigurasi lingkungan (<code>.env</code>), "
        "folder dependensi (<code>node_modules</code>, <code>venv</code>), dan file cache (<code>__pycache__</code>) disembunyikan menggunakan file "
        "<code>.gitignore</code> agar tidak terpublikasi. Setelah commit pertama dibuat, seluruh kode diunggah ke repository GitHub publik di: "
        "<code>https://github.com/MutiaElvira/HelloLunare.git</code>.",
        body_style
    ))

    # Supabase
    story.append(Paragraph("<b>Langkah 2: Konfigurasi Database Supabase</b>", bold_body_style))
    story.append(Paragraph(
        "Database PostgreSQL disiapkan di cloud menggunakan platform Supabase. Connection string PostgreSQL disalin dari dashboard Supabase "
        "dan dipasang pada konfigurasi backend melalui variabel lingkungan <code>DATABASE_URL</code>.",
        body_style
    ))

    # Railway
    story.append(Paragraph("<b>Langkah 3: Deployment Backend di Railway & Konfigurasi Port</b>", bold_body_style))
    story.append(Paragraph(
        "Backend dideploy ke layanan cloud Railway dengan langkah taktis berikut:",
        body_style
    ))
    story.append(Paragraph("1. Mengimpor repository GitHub ke dalam proyek Railway baru.", bullet_style))
    story.append(Paragraph("2. <b>Mengatur Root Directory</b> ke folder <code>backend</code> karena file backend FastAPI berada di subfolder tersebut.", bullet_style))
    story.append(Paragraph("3. Memasukkan variabel lingkungan <code>DATABASE_URL</code> secara manual ke tab Variables Railway agar database dapat terhubung.", bullet_style))
    story.append(Paragraph("4. Menganalisis log deployment dan menemukan bahwa Uvicorn berjalan di port <b><code>8080</code></b>. Pengaturan port komunikasi di Railway disesuaikan menjadi <code>8080</code> agar proxy Railway dapat meneruskan data secara lancar.", bullet_style))
    story.append(Paragraph("5. **Membuat Public Domain** gratis berakhiran <code>.up.railway.app</code> agar backend dapat menerima request HTTPS dari luar.", bullet_style))
    
    story.append(PageBreak()) # Clean page break for Vercel & Mobile steps

    # Vercel
    story.append(Paragraph("<b>Langkah 4: Deployment Frontend di Vercel & Integrasi API</b>", bold_body_style))
    story.append(Paragraph(
        "Frontend dideploy menggunakan Vercel dengan langkah integrasi berikut:",
        body_style
    ))
    story.append(Paragraph("1. Mengimpor repository GitHub ke Vercel.", bullet_style))
    story.append(Paragraph("2. **Menyambungkan Frontend ke Backend**: Mengatur Environment Variable <b><code>VITE_API_URL</code></b> di pengaturan Vercel dengan nilai domain publik backend Railway (<code>https://hello-lunare-production.up.railway.app</code>). Hal ini krusial agar frontend tidak lagi menembak localhost (<code>127.0.0.1</code>) yang menyebabkan error saat diakses dari HP.", bullet_style))
    story.append(Paragraph("3. Melakukan <b>Redeploy</b> di Vercel agar variabel lingkungan baru tersebut aktif dan tertanam di client build.", bullet_style))

    story.append(Spacer(1, 10))

    # SECTION 3: PENYEMPURNAAN DESAIN & FITUR BARU
    story.append(Paragraph("3. Penyempurnaan Fitur & Responsivitas Mobile", h1_style))
    story.append(Paragraph(
        "Setelah aplikasi berhasil mengudara, dilakukan peningkatan fitur dan perbaikan visual agar aplikasi lebih premium:",
        body_style
    ))
    story.append(Paragraph("• <b>Tata Letak Mobile-Friendly</b>: Struktur layout utama diubah dari baris horizontal statis menjadi kolom vertikal di mobile (<code>flex-col lg:flex-row</code>). Menu samping (sidebar) bertransformasi menjadi top-bar horizontal yang elegan di HP dengan padding yang rapi.", bullet_style))
    story.append(Paragraph("• <b>Hapus Fitur Unused</b>: Menghapus total fitur Pesan Privat (Private Messages) dan Mood Journal lama dari backend & frontend untuk menyederhanakan menu aplikasi.", bullet_style))
    story.append(Paragraph("• <b>Pelacak Gejala Harian (Physical & Mental Symptoms)</b>: Mengimplementasikan tracker gejala harian interaktif baru yang memetakan ke tabel <code>symptoms</code> Supabase. Menampilkan Gejala Fisik (Kram Perut, Sakit Kepala, dll) dan Gejala Mental (Insomnia, Cemas, dll) dengan opsi tingkat keparahan (Mild, Mod, Sev) yang berubah warna secara visual.", bullet_style))
    story.append(Paragraph("• <b>Update Laporan Kesehatan & PDF</b>: Mengintegrasikan riwayat gejala ke dalam sistem visualisasi Laporan Kesehatan dan file unduhan PDF. Laporan kini menampilkan total frekuensi kemunculan gejala dan catatan keluhan terbaru.", bullet_style))
    story.append(Spacer(1, 15))

    # CALLOUT BOX (Tip/Notes)
    callout_data = [[
        Paragraph(
            "<b>Catatan Pengoperasian:</b><br/>"
            "Jika di kemudian hari Anda melakukan perubahan kode di laptop, Anda hanya perlu menjalankan perintah:<br/>"
            "<code>git add .</code><br/>"
            "<code>git commit -m 'Catatan Perubahan'</code><br/>"
            "<code>git push origin main</code><br/>"
            "Vercel dan Railway akan mendeteksi push tersebut dan meng-update website secara otomatis dalam hitungan menit.",
            tip_style
        )
    ]]
    callout_table = Table(callout_data, colWidths=[doc.width])
    callout_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F0FDF4')), # Light green
        ('PADDING', (0,0), (-1,-1), 10),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#DCFCE7')),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(callout_table)
    story.append(Spacer(1, 20))

    # Conclusion / Footer Statement
    story.append(Paragraph(
        "Dokumentasi ini membuktikan bahwa proyek Lunare kini telah berjalan sepenuhnya secara online dengan integrasi database "
        "cloud, server backend Railway, dan client frontend Vercel yang saling terhubung secara aman (HTTPS).",
        body_style
    ))

    # Build the document
    doc.build(story, canvasmaker=NumberedCanvas)

if __name__ == "__main__":
    build_pdf()
    print("PDF generated successfully.")
