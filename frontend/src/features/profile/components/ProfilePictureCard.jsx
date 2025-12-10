import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import Input from "../../../components/Input";
import { FiCamera, FiEdit2, FiSave, FiX, FiLoader } from "react-icons/fi";
import toast from "react-hot-toast";

import { uploadToCloudinary } from "../../../services/storageServices";
import { CLOUDINARY_FOLDER_AVATAR } from "../../../config";
import { updateUserProfile } from "../../auth/services/authService";

const ProfilePictureCard = () => {
  const { user, refreshProfile } = useAuth();

  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(user?.username || "");
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setEditedName(user.username || "");
    }
  }, [user]);

  const handleNameChange = (e) => {
    setEditedName(e.target.value);
  };

  const handleSaveName = async () => {
    if (!editedName.trim()) {
      toast.error("Username tidak boleh kosong");
      return;
    }

    const toastId = toast.loading("Menyimpan perubahan...");

    try {
      const payload = {
        username: editedName,
        avatar_url: user.avatar_url,
      };

      await updateUserProfile(payload);

      await refreshProfile();

      toast.success("Username berhasil diperbarui!", { id: toastId });
      setIsEditingName(false);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Gagal update username", { id: toastId });
    }
  };

  const handleCancelEdit = () => {
    setEditedName(user?.username || "");
    setIsEditingName(false);
  };

  // Change Photo Logic
  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 2. Handle file selection & upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran foto maksimal 2MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar");
      return;
    }

    setIsUploading(true);
    const loadingToast = toast.loading("Mengunggah foto...");

    try {
      const photoUrl = await uploadToCloudinary(file, CLOUDINARY_FOLDER_AVATAR);

      const payload = {
        avatar_url: photoUrl,
        username: user.username,
      };

      await updateUserProfile(payload);

      await refreshProfile();

      toast.success("Foto profil berhasil diperbarui!", { id: loadingToast });
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengunggah foto.", { id: loadingToast });
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (!user) return null;

  // --- HELPER RENDERING ---
  const getRoleName = (roleData) => {
    if (!roleData) return "Pengguna";
    if (typeof roleData === "string") return roleData;
    return roleData.label || roleData.name || "Pengguna";
  };

  return (
    <div className="flex flex-col items-center bg-white dark:bg-slate-800 shadow-lg rounded-xl p-8 text-center border border-slate-100 dark:border-slate-700">
      {/* --- Profile Picture Section --- */}
      <div className="relative mb-6 group">
        <div className="w-36 h-36 rounded-full p-1 border-2 border-dashed border-slate-300 dark:border-slate-600 group-hover:border-[#429EBD] transition-all">
          <div className="w-full h-full rounded-full overflow-hidden relative">
            {isUploading ? (
              <div className="absolute inset-0 bg-slate-100 dark:bg-slate-700 flex items-center justify-center z-10">
                <FiLoader
                  className="animate-spin text-[#053F5C] dark:text-[#429EBD]"
                  size={32}
                />
              </div>
            ) : (
              <img
                src={
                  user.avatar_url ||
                  `https://ui-avatars.com/api/?name=${user.username?.[0]}&background=0D8ABC&color=fff`
                }
                onClick={handleCameraClick}
                alt="Foto Profil"
                className="w-full h-full object-cover transition-transform group-hover:scale-105 cursor-pointer"
              />
            )}

            {/* Overlay if hover */}
            {!isUploading && (
              <div
                onClick={handleCameraClick}
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
              >
                <span className="text-white text-xs sm:text-sm font-medium">
                  Ganti Foto
                </span>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleCameraClick}
          disabled={isUploading}
          className="absolute bottom-2 right-2 bg-[#053F5C] text-white p-2.5 rounded-full shadow-md hover:bg-[#075075] transition-transform hover:scale-110 cursor-pointer disabled:opacity-50"
          title="Ganti Foto"
        >
          <FiCamera size={18} />
        </button>

        {/* Input File */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/jpg"
        />
      </div>

      {/* --- User Name Section --- */}
      <div className="w-full">
        {isEditingName ? (
          <div className="animate-fade-in">
            <div className="max-w-xs mx-auto mb-3">
              <Input
                id="edit-name"
                value={editedName}
                onChange={handleNameChange}
                className="text-center font-bold"
                autoFocus
              />
            </div>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={handleCancelEdit}
                className="flex items-center justify-center min-h-11 min-w-11 p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                title="Batal"
              >
                <FiX size={20} />
              </button>
              <button
                onClick={handleSaveName}
                className="flex items-center justify-center min-h-11 min-w-11 gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
              >
                <FiSave size={20} /> Simpan
              </button>
            </div>
          </div>
        ) : (
          <div className="group relative inline-block">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white truncate">
              {user.username || "Nama Pengguna"}
            </h2>

            <p className="text-sm md:text-[15px] font-medium text-[#429EBD] mt-1">
              {user.opd?.name || "OPD Tidak Terdaftar"}
            </p>

            <p className="text-xs md:text-[13px] text-slate-500 dark:text-slate-400 mt-1 mb-2">
              {getRoleName(user.role)}
            </p>

            <button
              onClick={() => setIsEditingName(true)}
              className="absolute -right-8 top-1 text-slate-400 hover:text-[#053F5C] dark:hover:text-[#429EBD] group-hover:cursor-pointer p-1"
              title="Edit Username"
            >
              <FiEdit2 size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePictureCard;
