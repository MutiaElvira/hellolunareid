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

function Sidebar({ activeSection, setActiveSection }) {
  const { logout } = useAuth();

  return (
    <div className="flex w-72 bg-gradient-to-b from-pink-200 to-purple-200 p-8 flex-col justify-between h-full">
      <div>
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-white p-4 rounded-full shadow-md">
            <FaMoon className="text-pink-400 text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Lunare</h1>
            <p className="text-white/80 text-sm">Your wellness companion</p>
          </div>
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
              onClick={() => setActiveSection(item.id)}
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
