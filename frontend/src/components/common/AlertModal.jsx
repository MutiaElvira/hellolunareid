import { FaTimes, FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";

function AlertModal({ isOpen, type, title, message, onConfirm, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(59, 47, 74, 0.5)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[28px] shadow-2xl max-w-md w-full overflow-hidden"
        style={{ animation: "alertSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          className="p-6 flex items-center gap-4"
          style={{
            background:
              type === "error"
                ? "linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)"
                : type === "confirm"
                ? "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)"
                : "linear-gradient(135deg, #FDF2F8 0%, #F5F3FF 100%)",
          }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center shadow-sm"
            style={{
              backgroundColor:
                type === "error"
                  ? "#FCA5A5"
                  : type === "confirm"
                  ? "#FCD34D"
                  : "#C4B5FD",
            }}
          >
            {type === "error" ? (
              <FaTimes className="text-white text-lg" />
            ) : type === "confirm" ? (
              <FaExclamationTriangle className="text-white text-lg" />
            ) : (
              <FaInfoCircle className="text-white text-lg" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#3B2F4A]">{title}</h3>
          </div>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-5">
          <p className="text-gray-600 text-sm leading-relaxed">{message}</p>
        </div>

        {/* Modal Actions */}
        <div className="px-6 pb-6 flex gap-3 justify-end">
          {type === "confirm" ? (
            <>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-all duration-200"
              >
                Batal
              </button>
              <button
                onClick={onConfirm}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-md hover:scale-[1.03] active:scale-[0.97] transition-all duration-200"
                style={{ background: "linear-gradient(135deg, #F472B6, #A78BFA)" }}
              >
                Ya, Lanjutkan
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white shadow-md hover:scale-[1.03] active:scale-[0.97] transition-all duration-200"
              style={{ background: "linear-gradient(135deg, #F472B6, #A78BFA)" }}
            >
              Mengerti
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AlertModal;
