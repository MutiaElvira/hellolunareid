import {
  FaMoon,
  FaCalendarAlt,
  FaHeart,
  FaSmile,
  FaFilePdf,
  FaSignOutAlt,
  FaBookOpen,
  FaCommentDots,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

function Sidebar({ activeSection, setActiveSection }) {
  const { logout } = useAuth();

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:flex w-72 bg-gradient-to-b from-pink-200 to-purple-200 p-8 flex-col justify-between">
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
              { id: "mood", icon: <FaSmile />, label: "Mood Journal" },
              { id: "education", icon: <FaBookOpen />, label: "Edukasi" },
              { id: "messages", icon: <FaCommentDots />, label: "Pesan Privat" },
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

      {/* MOBILE NAV (Rendered inside the main container in Dashboard usually, but can be extracted here for layout) */}
      <div className="flex lg:hidden gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { key: "dashboard", icon: <FaCalendarAlt />, label: "Dashboard" },
          { key: "tracker", icon: <FaHeart />, label: "Tracker" },
          { key: "mood", icon: <FaSmile />, label: "Mood" },
          { key: "education", icon: <FaBookOpen />, label: "Edukasi" },
          { key: "messages", icon: <FaCommentDots />, label: "Pesan" },
          { key: "report", icon: <FaFilePdf />, label: "Laporan" },
          { key: "profile", icon: <FaSmile />, label: "Profile" },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveSection(item.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition ${
              activeSection === item.key
                ? "bg-gradient-to-r from-pink-300 to-purple-300 text-white"
                : "bg-pink-50 text-pink-500"
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}

        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap bg-red-50 text-red-400 transition hover:bg-red-100 ml-auto"
        >
          <FaSignOutAlt />
        </button>
      </div>
    </>
  );
}

export default Sidebar;
