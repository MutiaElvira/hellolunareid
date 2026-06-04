import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaInstagram, FaEnvelope, FaCalendarAlt, FaHeartbeat, FaFilePdf, FaArrowRight } from "react-icons/fa";

function LandingPage() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleStart = () => {
    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F6] text-[#3B2F4A] font-sans flex flex-col justify-between">
      
      {/* NAVBAR */}
      <nav className="max-w-7xl mx-auto w-full px-6 py-5 flex items-center justify-between border-b border-pink-100/40 bg-white/40 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="text-pink-400 text-2xl select-none">🌙</span>
          <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Lunare
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          {token ? (
            <Link
              to="/dashboard"
              className="bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white px-5 py-2.5 rounded-full text-xs font-bold transition shadow-xs"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-[#B57EDC] hover:text-purple-700 text-xs font-bold transition"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                className="bg-[#E8B4D3] hover:bg-[#d99ac1] text-white px-5 py-2.5 rounded-full text-xs font-bold transition shadow-xs"
              >
                Daftar
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="max-w-7xl mx-auto w-full px-6 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <span className="bg-pink-100/60 text-pink-600 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
            Your Wellness Companion
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
            Harmoni Siklus, <br />
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Kesehatan Terjaga
            </span>
          </h1>
          <p className="text-sm md:text-base text-gray-500 leading-relaxed max-w-lg">
            Lunare membantu Anda memantau siklus bulanan, mengenali keluhan tubuh secara fisik & mental, serta mengunduh laporan kesehatan lengkap secara privat dan mandiri.
          </p>
          <button
            onClick={handleStart}
            className="bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white font-bold px-8 py-4 rounded-2xl shadow-md flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-sm"
          >
            Mulai Eksplorasi
            <FaArrowRight size={12} />
          </button>
        </div>
        
        <div className="flex justify-center">
          <div className="w-full max-w-md bg-white p-4 rounded-[42px] shadow-lg border border-pink-100/30">
            <img
              src="/lunare_hero.png"
              alt="Lunare Hero Illustration"
              className="w-full h-auto object-cover rounded-[32px]"
            />
          </div>
        </div>
      </header>

      {/* INTRODUCTION & HISTORY SECTION */}
      <section className="bg-white py-16 md:py-24 border-y border-pink-100/30">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-2xl md:text-3xl font-black text-[#3B2F4A]">Tentang Lunare</h2>
          <p className="text-sm md:text-base text-gray-500 leading-relaxed">
            Nama <b>Lunare</b> terinspirasi dari kata <i>Luna</i> (Bulan), melambangkan siklus biologis bulanan wanita yang memiliki pola pasang-surut yang indah layaknya fase bulan di langit malam. 
          </p>
          <p className="text-sm md:text-base text-gray-500 leading-relaxed">
            Diciptakan oleh tim pengembang mahasiswi sebagai solusi komprehensif, kami memanggil para pengguna setia aplikasi kami dengan sapaan akrab <b>“Lunarian”</b> — representasi perempuan mandiri, peduli kesehatan diri, dan menjalani hari-hari dengan kesadaran penuh akan kesehatan reproduksi mereka.
          </p>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="max-w-7xl mx-auto w-full px-6 py-16 md:py-24 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <h2 className="text-3xl font-black">Fitur Utama Lunare</h2>
          <p className="text-xs text-gray-500">
            Dirancang secara khusus untuk kenyamanan dan privasi total data kesehatan Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-[32px] border border-pink-100/40 shadow-xs hover:shadow-md transition space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="bg-pink-50 p-4 rounded-full w-fit">
                <FaCalendarAlt className="text-pink-500 text-xl" />
              </div>
              <h3 className="text-lg font-bold">Cycle Tracker</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Pantau hari menstruasi kamu, catat siklus secara periodik, dan dapatkan prediksi otomatis untuk tanggal menstruasi berikutnya serta jendela masa subur.
              </p>
            </div>
            <img
              src="/lunare_cycle.png"
              alt="Cycle Tracker Feature"
              className="w-full h-40 object-cover rounded-2xl mt-4"
            />
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-[32px] border border-pink-100/40 shadow-xs hover:shadow-md transition space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-full w-fit">
                <FaHeartbeat className="text-purple-500 text-xl" />
              </div>
              <h3 className="text-lg font-bold">Jurnal Gejala Harian</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Catat gejala fisik & mental (kram perut, kembung, cemas, insomnia, dll) dengan tingkat keparahan yang fleksibel untuk memantau pengaruh hormon pada keseharian.
              </p>
            </div>
            <img
              src="/lunare_symptoms.png"
              alt="Symptom Journal Feature"
              className="w-full h-40 object-cover rounded-2xl mt-4"
            />
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-[32px] border border-pink-100/40 shadow-xs hover:shadow-md transition space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="bg-indigo-50 p-4 rounded-full w-fit">
                <FaFilePdf className="text-indigo-500 text-xl" />
              </div>
              <h3 className="text-lg font-bold">Laporan Kesehatan</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Unduh rangkuman riwayat siklus menstruasi dan catatan gejala harian dalam format dokumen PDF secara instan untuk konsultasi ke dokter atau arsip pribadi.
              </p>
            </div>
            <div className="h-40 bg-gradient-to-br from-pink-50 to-indigo-50 rounded-2xl flex items-center justify-center p-4 mt-4">
              <span className="text-4xl text-indigo-400 select-none">📊📄</span>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER & DEVELOPER INFO */}
      <footer className="bg-white border-t border-pink-100/50 py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-b border-gray-100 pb-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-pink-400 text-xl select-none">🌙</span>
              <span className="text-xl font-bold tracking-tight text-gray-800">Lunare</span>
            </div>
            <p className="text-xs text-gray-500 max-w-sm leading-relaxed">
              Membantu perempuan mengarungi siklus biologis dengan kesadaran dan harmoni.
            </p>
            
            {/* Email */}
            <div className="flex items-center gap-2 text-xs text-gray-600 font-semibold pt-2">
              <FaEnvelope className="text-pink-400" />
              <a href="mailto:hellolunareid@gmail.com" className="hover:text-pink-500 transition">
                hellolunareid@gmail.com
              </a>
            </div>
          </div>

          {/* Developer Instagram Link list */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-widest">
              Hubungi Pengembang (Instagram)
            </h4>
            <div className="flex flex-wrap gap-4 pt-1">
              {[
                { name: "Mutia Elvira", handle: "@mutiaplv", url: "https://instagram.com/mutiaplv" },
                { name: "Nazhiva S. A.", handle: "@nazhiva.sa", url: "https://instagram.com/nazhiva.sa" },
                { name: "Anggun Cahaya", handle: "@angguncahaya._", url: "https://instagram.com/angguncahaya._" },
              ].map((dev) => (
                <a
                  key={dev.handle}
                  href={dev.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-pink-50/50 hover:bg-pink-100/60 rounded-xl text-xs text-pink-600 hover:text-pink-700 font-bold border border-pink-100/40 transition hover:scale-[1.02]"
                >
                  <FaInstagram size={13} />
                  <span>{dev.name} ({dev.handle})</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-400 font-semibold gap-4">
          <p>© {new Date().getFullYear()} Lunare. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/login" className="hover:text-pink-500 transition">Masuk</Link>
            <Link to="/register" className="hover:text-pink-500 transition">Daftar</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default LandingPage;
