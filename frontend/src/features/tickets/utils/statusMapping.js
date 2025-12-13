export const mapBackendStatusToUI = (status, stage) => {
  if (status === "resolved") return "Selesai";
  if (status === "closed") return "Ditutup";
  if (status === "rejected") return "Ditolak";

  // Logic Incident & Request
  if (status === "open" && stage === "triase") return "Baru Masuk";
  if (status === "assigned" && stage === "verification") return "Ditugaskan";
  if (status === "in_progress" && stage === "analysis") return "Perlu Analisa";
  if (status === "pending_approval" && stage === "approval_seksi")
    return "Menunggu Aprv. Seksi";
  if (status === "pending_approval" && stage === "approval_bidang")
    return "Menunggu Aprv. Bidang";
  if (status === "in_progress" && stage === "ready_to_execute")
    return "Disetujui";
  if (status === "assigned" && stage === "revision") return "Revisi";
  if (status === "in_progress" && stage === "execution")
    return "Sedang Dikerjakan";

  return status;
};

// export const mapUiFilterToBackendParams = (uiStatus) => {
//   const map = {
//     Ditugaskan: "assigned",
//     "Sedang Dikerjakan": "in_progress",
//     Selesai: "resolved",
//     "Perlu Analisa": "in_progress",
//     Disetujui: "in_progress",
//     Ditolak: "rejected",
//     "Baru Masuk": "open",
//     Semua: null,
//   };
//   return map[uiStatus] || null;
// };
