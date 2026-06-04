import { Link } from "react-router-dom";
import { FaMoon } from "react-icons/fa";
import { useState } from "react";
import AlertModal from "../components/common/AlertModal";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });

  const closeAlert = () => {
    setAlertModal((prev) => ({ ...prev, isOpen: false }));
    // Dashboard redirection is handled by App.jsx ProtectedRoute when token changes
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
    } catch (error) {
      console.log(error);
      setAlertModal({
        isOpen: true,
        type: "error",
        title: "Login Gagal",
        message: "Email atau password yang Anda masukkan salah.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F5F2]">
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl">
        <div className="flex justify-center mb-5">
          <div className="bg-[#E8B4D3] p-4 rounded-full">
            <FaMoon className="text-white text-3xl" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-center mb-2">Lunare</h1>
        <p className="text-center text-gray-500 mb-8">Track your cycle beautifully</p>

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:border-[#E8B4D3]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:border-[#E8B4D3]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E8B4D3] hover:bg-[#d99ac1] text-white p-4 rounded-xl font-semibold transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-500">
          Don’t have an account?{" "}
          <Link to="/register" className="text-[#B57EDC] font-semibold">
            Register
          </Link>
        </p>
      </div>

      <AlertModal
        isOpen={alertModal.isOpen}
        type={alertModal.type}
        title={alertModal.title}
        message={alertModal.message}
        onClose={closeAlert}
      />
    </div>
  );
}

export default Login;