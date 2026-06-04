import { Link, useNavigate } from "react-router-dom";
import { FaMoon } from "react-icons/fa";
import { useState } from "react";
import AlertModal from "../components/common/AlertModal";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });

  const closeAlert = () => {
    setAlertModal((prev) => ({ ...prev, isOpen: false }));
    if (alertModal.type === "info" && alertModal.title === "Registrasi Berhasil") {
      navigate("/");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !email || !password) {
      setAlertModal({
        isOpen: true,
        type: "error",
        title: "Validasi Gagal",
        message: "Mohon isi semua form pendaftaran.",
      });
      return;
    }

    if (password.length < 6) {
      setAlertModal({
        isOpen: true,
        type: "error",
        title: "Validasi Gagal",
        message: "Password harus terdiri dari minimal 6 karakter.",
      });
      return;
    }

    setLoading(true);

    try {
      await register(username, email, password);
      
      setAlertModal({
        isOpen: true,
        type: "info",
        title: "Registrasi Berhasil",
        message: "Akun Anda berhasil dibuat! Silakan login untuk melanjutkan.",
      });

    } catch (error) {
      console.log(error);

      if (error.response?.data?.detail) {
        setAlertModal({
          isOpen: true,
          type: "error",
          title: "Registrasi Gagal",
          message: error.response.data.detail,
        });
      } else {
        setAlertModal({
          isOpen: true,
          type: "error",
          title: "Registrasi Gagal",
          message: "Gagal membuat akun. Silakan coba lagi.",
        });
      }

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
        <h1 className="text-4xl font-bold text-center mb-2">Create Account</h1>
        <p className="text-center text-gray-500 mb-8">Start tracking your cycle beautifully</p>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-5 text-sm text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:border-[#E8B4D3] transition"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:border-[#E8B4D3] transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:border-[#E8B4D3] transition"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E8B4D3] hover:bg-[#d99ac1] text-white p-4 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-500">
          Already have an account?{" "}
          <Link to="/" className="text-[#B57EDC] font-semibold hover:underline">
            Login
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

export default Register;