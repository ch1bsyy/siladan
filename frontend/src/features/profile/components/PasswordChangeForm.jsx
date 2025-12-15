import React, { useState } from "react";
import Input from "../../../components/Input";
import { FiSave, FiEye, FiEyeOff, FiLoader } from "react-icons/fi";
import { changePassword } from "../../auth/services/authService";

const PasswordChangeForm = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Password baru dan konfirmasi tidak cocok.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password baru minimal 8 karakter.");
      return;
    }

    setIsLoading(true);

    try {
      // Panggil API
      await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      // Jika sukses
      setSuccess(
        "Password berhasil diubah. Silakan login ulang jika diperlukan."
      );

      // Reset Form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      // Jika error dari API
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 shadow-lg rounded-lg p-6">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-700 pb-3">
        Ganti Password
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="current-password"
          name="current-password"
          label="Password Saat ini"
          type={showPassword.current ? "text" : "password"}
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          rightIcon={
            showPassword.current ? <FiEyeOff size={18} /> : <FiEye size={18} />
          }
          onRightIconClick={() => togglePasswordVisibility("current")}
          required
          disabled={isLoading}
        />
        <Input
          id="new-password"
          name="new-password"
          label="Password Baru"
          type={showPassword.new ? "text" : "password"}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          rightIcon={
            showPassword.new ? <FiEyeOff size={18} /> : <FiEye size={18} />
          }
          onRightIconClick={() => togglePasswordVisibility("new")}
          required
          disabled={isLoading}
        />
        <Input
          id="confirm-password"
          name="confirm-password"
          label="Konfirmasi Password Baru"
          type={showPassword.confirm ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          rightIcon={
            showPassword.confirm ? <FiEyeOff size={18} /> : <FiEye size={18} />
          }
          onRightIconClick={() => togglePasswordVisibility("confirm")}
          required
          disabled={isLoading}
        />

        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-green-500">{success}</p>}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-white transition-colors shadow-md duration-200 ${
              isLoading
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-[#429EBD] hover:bg-[#053F5C] cursor-pointer"
            }`}
          >
            {isLoading ? (
              <>
                <FiLoader className="animate-spin" size={18} />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <FiSave size={18} />
                <span>Simpan Password</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordChangeForm;
