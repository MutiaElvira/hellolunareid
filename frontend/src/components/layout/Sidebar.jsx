import {
  FaMoon,
  FaCalendarAlt,
  FaHeart,
  FaSmile,
  FaFilePdf,
  FaSignOutAlt,
  FaBookOpen,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

function Sidebar({ activeSection, setActiveSection, isOpen, setIsOpen }) {
  const { logout } = useAuth();

  const handleLinkClick = (id) => {
    setActiveSection(id);
    if (setIsOpen) setIsOpen(false);
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 lg:static z-50 flex w-72 bg-gradient-to-b from-pink-200 to-purple-200 p-8 flex-col justify-between h-full transition-transform duration-300 lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-3 mb-12">
          <div className="flex items-center gap-3">
            <div className="bg-white p-4 rounded-full shadow-md">
              <FaMoon className="text-pink-400 text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Lunare</h1>
              <p className="text-white/80 text-sm">Your wellness companion</p>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-white hover:bg-white/20 p-1.5 rounded-lg transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-3">
          {[
            { id: "dashboard", icon: <FaCalendarAlt />, label: "Dashboard" },
            { id: "tracker", icon: <FaHeart />, label: "Cycle Tracker" },
            { id: "symptoms", icon: <FaSmile />, label: "Jurnal Harian" },
            { id: "education", icon: <FaBookOpen />, label: "Edukasi" },
            { id: "report", icon: <FaFilePdf />, label: "Laporan Kesehatan" },
            { id: "profile", icon: <FaSmile />, label: "My Profile" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleLinkClick(item.id)}
              className={`w-full rounded-2xl p-4 flex items-center gap-3 font-semibold transition-all duration-200 ${
                activeSection === item.id
                  ? "bg-white/40 backdrop-blur-md text-white shadow-sm"
                  : "text-white/80 hover:bg-white/20"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={logout}
        className="bg-white text-pink-400 font-semibold py-4 rounded-2xl hover:scale-105 transition flex items-center justify-center gap-2"
      >
        <FaSignOutAlt />
        Logout
      </button>
    </div>
  );
}

export default Sidebar;
