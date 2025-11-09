import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom"; // Catch data from QR
import { useAuth } from "../../../context/AuthContext";
import { useLoading } from "../../../context/LoadingContext";
import toast from "react-hot-toast";

import Input from "../../../components/Input";
import FormTextArea from "../../../components/FormTextArea";
import FormSelect from "../../../components/FormSelect";
import FormFileUpload from "../../../components/FormFileUpload";
import { FiSend } from "react-icons/fi";

// Import Services
import { uploadToCloudinary } from "../../../services/storageServices";
import { createTicket } from "../services/ticketService";

const ComplaintForm = () => {
  const { isAuthenticated, user } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  const [searchParams] = useSearchParams();

  const fileInputRef = useRef(null);
  const isPegawai = isAuthenticated && user?.role?.name === "pegawai_opd";

  const [formData, setFormData] = useState({
    nama: "",
    nik: "",
    email: "",
    telepon: "",
    alamat: "",
    layanan: "",
    namaAset: searchParams.get("aset") || "",
    namaOpd: searchParams.get("opd") || "",
    judul: "",
    deskripsi: "",
    tanggalKejadian: "",
    lokasiKejadian: "",
    lampiran: null,
  });

  useEffect(() => {
    if (isPegawai && user) {
      setFormData((prev) => ({
        ...prev,
        nama: user.name || "",
        nik: user.nik || "",
        alamat: user.address || "",
        email: user.email || "",
        telepon: user.phone_number || "",
        namaOpd: user.opd?.value || prev.namaOpd,
      }));
    }
  }, [isPegawai, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file & (file.size > 5 * 1024 * 1024)) {
      toast.error("Ukuran file maksimal 5MB");
      e.target.value = null;
      return;
    }
    setFormData((prev) => ({ ...prev, lampiran: file || null }));
  };

  const clearFile = () => {
    setFormData((prev) => ({ ...prev, lampiran: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    showLoading("Mengirim laporan Anda...");

    try {
      let attachmentUrl = "";
      if (formData.lampiran) {
        toast.loading("Mengunggah lampiran...");
        attachmentUrl = await uploadToCloudinary(formData.lampiran);
        toast.dismiss();
      }

      const apiPayload = {
        type: "incident",
        title: formData.judul,
        description: formData.deskripsi,
        incident_date: formData.tanggalKejadian,
        location: formData.lokasiKejadian,
        asset_identifier: formData.namaAset,
        opd_identifier: formData.namaOpd,
        reporter_name: formData.nama,
        reporter_nik: formData.nik,
        reporter_email: formData.email,
        reporter_phone: formData.telepon,
        reporter_address: formData.alamat,
        attachment_url: attachmentUrl,
      };

      console.log("Mengirim Payload:", apiPayload);
      await createTicket(apiPayload);

      hideLoading();
      toast.success(
        "Laporan berhasil dikirim! tiket Anda akan segera ditangani."
      );

      if (!isPegawai) {
        setFormData({
          nama: "",
          nik: "",
          email: "",
          telepon: "",
          alamat: "",
          layanan: "",
          namaAset: searchParams.get("aset") || "",
          namaOpd: searchParams.get("opd") || "",
          judul: "",
          deskripsi: "",
          tanggalKejadian: "",
          lokasiKejadian: "",
          lampiran: null,
        });
      } else {
        setFormData((prev) => ({
          ...prev,
          layanan: "",
          namaAset: searchParams.get("aset") || "",
          judul: "",
          deskripsi: "",
          tanggalKejadian: "",
          lokasiKejadian: "",
          lampiran: null,
        }));
      }
    } catch (error) {
      console.error("Gagal submit tiket:", error);
      hideLoading();
      toast.error(
        error.message || "Gagal mengirim laporan. Silakan coba lagi."
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-lg shadow-xl overflow-hidden">
      <div className="p-6 sm:p-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-[#053F5C] dark:text-white">
          Formulir Pengaduan
        </h2>
        <p className="mt-2 text-sm lg:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          "Silakan isi detail pengaduan Anda pada form ini, kami akan segera
          menindaklanjutinya"
        </p>
      </div>

      <form onSubmit={handleSubmit} className="px-6 sm:px-10 pb-8 space-y-6">
        {/* Complainant Data */}
        <div className="border-b border-slate-200 dark:border-slate-700 pb-6">
          <h3 className="text-base md:text-lg font-medium leading-6 text-slate-900 bg-[#F7AD19] px-3 py-2 rounded-sm text-center dark:bg-[#916610] dark:text-white">
            Data Diri Pelapor
          </h3>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <Input
              id="nama"
              name="nama"
              label="Nama Lengkap"
              value={formData.nama}
              onChange={handleChange}
              placeholder="Masukkan nama lengkap"
              required
              disabled={isPegawai}
            />
            <Input
              id="nik"
              name="nik"
              label={isPegawai ? "NIP" : "NIK"}
              value={formData.nik}
              onChange={handleChange}
              placeholder={
                isPegawai
                  ? "Masukkan 16 digit angka NIK"
                  : "Masukkan digit angka NIP"
              }
              required
              disabled={isPegawai}
            />
            <Input
              id="email"
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="johndoe@email.com"
              required
              disabled={isPegawai}
            />
            <Input
              id="telepon"
              name="telepon"
              label="No. Telepon (WhatsApp)"
              type="tel"
              value={formData.telepon}
              onChange={handleChange}
              placeholder="0812xxxxxxxx"
              required
              disabled={isPegawai}
            />
            <div className="md:col-span-2">
              <FormTextArea
                id="alamat"
                name="alamat"
                label="Alamat Lengkap"
                value={formData.alamat}
                onChange={handleChange}
                placeholder="Masukkan alamat lengkap"
                rows={3}
                required
                disabled={isPegawai}
              />
            </div>
          </div>
        </div>

        {/* Complaint Details */}
        <div>
          <h3 className="text-base md:text-lg font-medium leading-6 text-slate-900 bg-[#F7AD19] px-3 py-2 rounded-sm text-center dark:bg-[#916610] dark:text-white">
            Detail Pengaduan
          </h3>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <FormSelect
              id="namaOpd"
              name="namaOpd"
              label="Nama OPD"
              value={formData.namaOpd}
              onChange={handleChange}
              required
              disabled={isPegawai}
            >
              <option value="" disabled>
                -- Pilih OPD --
              </option>
              <option value="inspektorat">Inspektorat</option>
              <option value="sekretariat_dprd">Sekretariat DPRD</option>
              <option value="dinas_kebudayaan_kepemudaan_dan_olahraga_serta_pariwisata">
                Dinas Kebudayaan Kepemudaan dan Olahraga serta Pariwisata
              </option>
              <option value="dinas_kependudukan_dan_pencatatan_sipil">
                Dinas Kependudukan dan Pencatatan Sipil
              </option>
              <option value="lainnya">lainnya</option>
            </FormSelect>
            <FormSelect
              id="layanan"
              name="layanan"
              label="Jenis Layanan"
              value={formData.layanan}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                -- Pilih Jenis Layanan --
              </option>
              <option value="aset_ti">Pengaduan Aset TI</option>
              <option value="jaringan">Gangguan Jaringan</option>
              <option value="sistem_info">Masalah Sistem Informasi</option>
              <option value="lainnya">Lainnya</option>
            </FormSelect>
            <FormSelect
              id="namaAset"
              name="namaAset"
              label="Nama Aset"
              value={formData.namaAset}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                -- Pilih Aset --
              </option>
              <option value="printer">Printer</option>
              <option value="ac">AC</option>
              <option value="Komputer">Komputer</option>
              <option value="aplikasi_x">Aplikasi X</option>
              <option value="lainnya">lainnya</option>
            </FormSelect>
            <Input
              id="tanggalKejadian"
              name="tanggalKejadian"
              label="Tanggal Kejadian"
              type="date"
              value={formData.tanggalKejadian}
              onChange={handleChange}
              required
            />
            <div className="md:col-span-2">
              <Input
                id="judul"
                name="judul"
                label="Judul Pengaduan"
                value={formData.judul}
                onChange={handleChange}
                placeholder="Contoh: Printer di Ruang A Rusak"
                required
              />
            </div>
            <div className="md:col-span-2">
              <FormTextArea
                id="deskripsi"
                name="deskripsi"
                label="Deskripsi Pengaduan"
                value={formData.deskripsi}
                onChange={handleChange}
                placeholder="Jelaskan secara detail masalah yang Anda hadapi..."
                rows={5}
                required
              />
            </div>
            <div className="md:col-span-2">
              <Input
                id="lokasiKejadian"
                name="lokasiKejadian"
                label="Lokasi Kejadian"
                value={formData.lokasiKejadian}
                onChange={handleChange}
                placeholder="Contoh: Gedung A, Lantai 2, Ruang Rapat"
                required
              />
            </div>
            <div className="md:col-span-2">
              <FormFileUpload
                id="lampiran"
                name="lampiran"
                label="Lampiran Bukti (Opsional)"
                file={formData.lampiran}
                onChange={handleFileChange}
                onClear={clearFile}
                ref={fileInputRef}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-[#053F5C] bg-[#F7AD19] hover:bg-yellow-400 dark:text-black dark:bg-yellow-400 dark:hover:bg-[#F7AD19] transition-all duration-300 shadow-lg cursor-pointer"
          >
            <FiSend size={18} />
            <span>Kirim Pengaduan</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ComplaintForm;
