import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiStar,
  FiMessageSquare,
  FiThumbsUp,
  FiArrowLeft,
  FiCheckCircle,
  FiThumbsDown,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { useLoading } from "../context/LoadingContext";

// MOCK DATA TIKET
const mockTicket = {
  id: "TK-0012",
  title: "Printer Macet di Keuangan",
  status: "Selesai",
  completedAt: "2025-11-19 14:30",
  technician: "Teknisi Budi",
  solution: "Mengganti roller printer dan cleaning head.",
};

const TicketRatingPage = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [isSolved, setIsSolved] = useState(null); // null, yes, no

  // Fetch Data Simulation
  useEffect(() => {
    // logic fetch API by ticketId
    console.log("Fetching ticket:", ticketId);
  }, [ticketId]);

  const ratingLabels = {
    1: "Sangat Kecewa",
    2: "Kurang Puas",
    3: "Cukup",
    4: "Puas",
    5: "Sangat Puas",
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Mohon berikan bintang terlebih dahulu.");
      return;
    }
    if (isSolved === null) {
      toast.error("Mohon konfirmasi apakah masalah teratasi.");
      return;
    }

    showLoading("Mengirim ulasan...");

    // Simulasi API Call Submit Rating
    setTimeout(() => {
      hideLoading();
      toast.success("Terima kasih! Ulasan Anda berhasil dikirim.");
      navigate("/track-ticket"); // Or backe dashboard/home
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-start">
      <div className="max-w-2xl w-full space-y-6 animate-fade-in">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-[#053F5C] dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <FiArrowLeft size={20} /> Kembali
        </button>

        {/* Main Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-700">
          {/* Header (Success Context) */}
          <div className="bg-green-600 p-6 text-center text-white">
            <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-3 backdrop-blur-sm">
              <FiCheckCircle size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold">Tiket Selesai!</h1>
            <p className="text-green-100 text-sm mt-1">
              Bantu kami meningkatkan layanan dengan memberikan ulasan.
            </p>
          </div>

          <div className="p-8">
            {/* Ticket Info */}
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 mb-8 border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-mono font-bold text-slate-500">
                  #{ticketId || mockTicket.id}
                </span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                  Selesai
                </span>
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white text-lg">
                {mockTicket.title}
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Ditangani oleh:{" "}
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {mockTicket.technician}
                </span>
              </p>
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-400 uppercase font-bold mb-1">
                  Solusi Teknisi:
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                  "{mockTicket.solution}"
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* 1. Star Rating */}
              <div className="text-center">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">
                  Seberapa puas Anda dengan layanan kami?
                </label>
                <div className="flex justify-center gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="transition-transform hover:scale-110 focus:outline-none"
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                      onClick={() => setRating(star)}
                    >
                      <FiStar
                        size={40}
                        className={`${
                          star <= (hover || rating)
                            ? "fill-yellow-400 text-yellow-400 drop-shadow-sm"
                            : "fill-slate-100 text-slate-300 dark:fill-slate-700 dark:text-slate-600"
                        } transition-colors duration-200`}
                      />
                    </button>
                  ))}
                </div>
                <p
                  className={`text-sm font-bold h-6 transition-all ${
                    rating > 0
                      ? "text-[#053F5C] dark:text-[#429EBD]"
                      : "text-transparent"
                  }`}
                >
                  {ratingLabels[hover || rating] || ""}
                </p>
              </div>

              {/* 2. Yes/No Question */}
              <div className="text-center">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Apakah masalah Anda benar-benar teratasi?
                </label>
                <div className="flex justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => setIsSolved(true)}
                    className={`px-6 py-2 rounded-lg border flex items-center gap-2 transition-all ${
                      isSolved === true
                        ? "bg-green-600 text-white border-green-600 shadow-md"
                        : "border-slate-300 text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700"
                    }`}
                  >
                    <FiThumbsUp size={18} /> Ya, Teratasi
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSolved(false)}
                    className={`px-6 py-2 rounded-lg border flex items-center gap-2 transition-all ${
                      isSolved === false
                        ? "bg-red-600 text-white border-red-600 shadow-md"
                        : "border-slate-300 text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700"
                    }`}
                  >
                    <FiThumbsDown size={18} className="rotate-180" /> Tidak
                  </button>
                </div>
              </div>

              {/* 3. Comment */}
              <div>
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Berikan ulasan atau masukan (Opsional)
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 text-slate-400">
                    <FiMessageSquare size={18} />
                  </div>
                  <textarea
                    id="comment"
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Contoh: Teknisi sangat ramah dan cepat..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#053F5C] outline-none transition-all resize-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 bg-[#053F5C] text-white font-bold rounded-xl hover:bg-[#075075] transition-all shadow-lg active:scale-95 flex justify-center items-center gap-2"
              >
                Kirim Penilaian
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketRatingPage;
