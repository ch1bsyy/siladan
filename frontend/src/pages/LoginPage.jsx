import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLoading } from "../context/LoadingContext";
import Input from "../components/Input";
import { FiUser, FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const { isLoading, showLoading, hideLoading } = useLoading();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const validate = (name, value) => {
    switch (name) {
      case "email":
        if (!value) return "Email wajib diisi.";
        if (!/\S+@\S+\.\S+/.test(value)) return "Format email tidak valid.";
        return "";
      case "password":
        if (!value) return "Password wajib diisi.";
        if (value.length < 6) return "Password minimal 6 karakter.";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    const val = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));

    if (name === "email" || name === "password") {
      const error = validate(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (key === "email" || key === "password") {
        const error = validate(key, formData[key]);
        if (error) {
          newErrors[key] = error;
        }
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      showLoading("Autentikasi Pengguna...");

      try {
        const userData = await login(formData.username, formData.password);
        toast.success(
          `Login berhasil! Selamat datang, ${
            userData.username || userData.name
          }`
        );
      } catch (err) {
        setServerError(
          err.message || "Login gagal. Periksa kembali kredensial anda."
        );
        toast.error(err.message || "Login gagal.");
      } finally {
        hideLoading();
      }
    }
  };

  const isFormValid =
    Object.values(errors).every((error) => !error) &&
    formData.username &&
    formData.password;

  return (
    <div className="min-h-screen p-4 flex flex-col justify-center items-center bg-slate-100 dark:bg-slate-900">
      <div className="w-full max-w-md bg-white dark:bg-[#053F5C]/50 rounded-xl shadow-md p-6 sm:p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 tracking-tight mt-2">
            Login ke Akun Anda
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Selamat datang kembali di SILADAN
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <Input
            id="username"
            label="Username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            placeholder="contoh@email.com"
            rightIcon={<FiUser size={18} />}
          />
          <Input
            id="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="••••••••"
            rightIcon={
              showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />
            }
            onRightIconClick={togglePasswordVisibility}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 block text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap"
              >
                Ingat saya
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
              >
                Lupa password?
              </a>
            </div>
          </div>

          {serverError && (
            <p className="text-sm text-center text-red-600">{serverError}</p>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading || !isFormValid}
              className="w-full min-h-[44px] min-w-[44px] flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 cursor-pointer disabled:cursor-not-allowed transition-colors"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
