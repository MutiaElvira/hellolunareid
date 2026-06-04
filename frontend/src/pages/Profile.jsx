import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import * as authService from "../services/authService";
import { API_BASE_URL } from "../services/api";
import usePeriods from "../hooks/usePeriods";
import useSymptoms from "../hooks/useSymptoms";
import { FaCamera, FaSave, FaHeart, FaCalendarAlt, FaSmile, FaUser } from "react-icons/fa";
import dayjs from "dayjs";
import AlertModal from "../components/common/AlertModal";

const calculateAge = (birthDate) => {
  if (!birthDate) return null;
  return dayjs().diff(dayjs(birthDate), "year");
};

const compressImage = (file, maxWidth = 400, maxHeight = 400, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type || "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error("Canvas toBlob failed"));
            }
          },
          file.type || "image/jpeg",
          quality
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

function Profile() {
  const { user, refreshProfile } = useAuth();
  const { periods, prediction, avgCycleLength, nextPeriodDate } = usePeriods();
  const { symptoms } = useSymptoms();
  
  const fileInputRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    full_name: "",
    birth_date: "",
    height: "",
    weight: ""
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Alert State
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        full_name: user.full_name || "",
        birth_date: user.birth_date || "",
        height: user.height ? user.height.toString() : "",
        weight: user.weight ? user.weight.toString() : ""
      });
    }
  }, [user]);

  const closeAlert = () => setAlertModal({ ...alertModal, isOpen: false });
  const showAlert = (title, message, type = "info") => {
    setAlertModal({ isOpen: true, type, title, message });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        full_name: formData.full_name || null,
        birth_date: formData.birth_date || null,
        height: formData.height ? parseFloat(formData.height) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
      };
      
      await authService.updateProfile(payload);
      await refreshProfile();
      showAlert("Success", "Profile updated successfully!", "info");
    } catch (error) {
      console.error(error);
      showAlert("Error", error.response?.data?.detail || "Failed to update profile.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size and type
    if (!file.type.match("image/(jpeg|jpg|png)")) {
      showAlert("Invalid File", "Only JPG, JPEG, and PNG images are allowed.", "error");
      return;
    }
    
    setIsUploading(true);
    try {
      // Compress the image before uploading to reduce database storage size
      const compressedFile = await compressImage(file);
      await authService.uploadProfilePhoto(compressedFile);
      await refreshProfile();
      showAlert("Success", "Profile picture updated!", "info");
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.detail || "Failed to upload photo. Please try again.";
      showAlert("Error", errMsg, "error");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeletePhoto = async () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus foto profil?")) {
      try {
        await authService.deleteProfilePhoto();
        await refreshProfile();
        showAlert("Success", "Profile picture deleted successfully!", "info");
      } catch (error) {
        console.error(error);
        showAlert("Error", "Failed to delete profile photo.", "error");
      }
    }
  };

  if (!user) return <div className="p-8 text-center text-gray-500">Loading profile data...</div>;

  const age = calculateAge(user.birth_date);
  const memberSince = user.created_at ? dayjs(user.created_at).format("MMMM YYYY") : "New Member";
  
  // Construct absolute image URL
  const profileImageUrl = user.profile_picture 
    ? (user.profile_picture.startsWith("http") || user.profile_picture.startsWith("data:image/") ? user.profile_picture : `${API_BASE_URL}${user.profile_picture}`)
    : null;

  return (
    <div className="mb-12 max-w-5xl mx-auto space-y-6">
      
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">My Profile</h1>
        <p className="text-gray-500">Manage your personal and health information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          
          {/* AVATAR CARD */}
          <div className="bg-white border border-pink-100 p-8 rounded-[32px] shadow-sm flex flex-col items-center text-center">
            <div className="relative mb-5 group">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center text-4xl font-bold text-white shadow-md border-4 border-white">
                {profileImageUrl ? (
                  <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user.username.charAt(0).toUpperCase()
                )}
              </div>
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute bottom-0 right-0 bg-purple-500 text-white p-3 rounded-full shadow-lg hover:bg-purple-600 hover:scale-110 transition disabled:opacity-50"
                title="Change Photo"
              >
                <FaCamera />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
            </div>

            <h2 className="text-2xl font-bold text-gray-800">{user.full_name || user.username}</h2>
            <p className="text-pink-500 font-medium mb-1">@{user.username}</p>
            
            <div className="mt-4 flex flex-col gap-1 text-sm text-gray-500 font-medium">
              {age !== null && <p>{age} Years Old</p>}
              <p>Member Since {memberSince}</p>
            </div>

            {profileImageUrl && (
              <button
                onClick={handleDeletePhoto}
                className="mt-4 text-xs font-bold text-red-400 hover:text-red-600 transition"
              >
                Hapus Foto Profil
              </button>
            )}
            
            {isUploading && <p className="text-xs text-purple-500 mt-4 animate-pulse">Uploading photo...</p>}
          </div>

          {/* MENSTRUAL INFO & STATS CARD */}
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-100 p-8 rounded-[32px] shadow-sm">
            <h3 className="text-lg font-bold mb-5 flex items-center gap-2 text-purple-700">
              <FaCalendarAlt /> Tracking Stats
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm">
                <span className="text-gray-500 text-sm font-medium">Total Cycles</span>
                <span className="font-bold text-lg text-pink-500">{periods.length}</span>
              </div>
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm">
                <span className="text-gray-500 text-sm font-medium">Symptom Logs</span>
                <span className="font-bold text-lg text-purple-500">{symptoms.length}</span>
              </div>
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm">
                <span className="text-gray-500 text-sm font-medium">Avg Cycle</span>
                <span className="font-bold text-lg text-gray-700">{avgCycleLength} Days</span>
              </div>
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm">
                <span className="text-gray-500 text-sm font-medium">Next Period</span>
                <span className="font-bold text-md text-gray-700">{nextPeriodDate}</span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (FORMS) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* PERSONAL INFORMATION CARD */}
          <div className="bg-white border border-pink-100 p-8 rounded-[32px] shadow-sm">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <FaUser className="text-pink-400" /> Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="w-full p-4 rounded-2xl border border-pink-100 outline-none focus:border-pink-300 transition"
                  placeholder="E.g., Jane Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full p-4 rounded-2xl border border-pink-100 outline-none focus:border-pink-300 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-4 rounded-2xl border border-pink-100 outline-none focus:border-pink-300 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Birth Date</label>
                <input
                  type="date"
                  name="birth_date"
                  value={formData.birth_date}
                  onChange={handleInputChange}
                  className="w-full p-4 rounded-2xl border border-pink-100 outline-none focus:border-pink-300 transition"
                />
              </div>
            </div>
          </div>

          {/* HEALTH INFORMATION CARD */}
          <div className="bg-white border border-pink-100 p-8 rounded-[32px] shadow-sm">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <FaHeart className="text-rose-400" /> Health Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Height (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  className="w-full p-4 rounded-2xl border border-pink-100 outline-none focus:border-pink-300 transition"
                  placeholder="E.g., 160.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className="w-full p-4 rounded-2xl border border-pink-100 outline-none focus:border-pink-300 transition"
                  placeholder="E.g., 55.2"
                />
              </div>
            </div>
          </div>

          {/* ACTION BUTTON */}
          <div className="flex justify-end">
            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white px-8 py-4 rounded-2xl font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <FaSave />
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>

        </div>

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

export default Profile;
