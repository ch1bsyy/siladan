import React, { useState } from "react";
import Input from "../../../components/Input";
import FormTextArea from "../../../components/FormTextArea";
import FormSelect from "../../../components/FormSelect";
import FormFileUpload from "../../../components/FormFileUpload";
import { FiSend } from "react-icons/fi";

const ComplaintForm = () => {
  const [formData, setFormData] = useState({
    nama: "",
    nik: "",
    alamat: "",
    email: "",
    telepon: "",
    layanan: "",
    judul: "",
    deskripsi: "",
    tanggalKejadian: "",
    lokasiKejadian: "",
    lampiran: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, lampiran: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Data Formulir", formData);
    // Submit API Logic
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-lg shadow-xl overflow-hidden">
      <div className="p-6 sm:p-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-[#053F5C] dark:text-white">
          Formulir Pengaduan
        </h2>
        <p className="mt-2 text-sm lg:text-base text-slate-600 dark:text-slate-400">
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
              label="Nama Lengkap"
              value={formData.nama}
              onChange={handleChange}
              placeholder="Masukkan nama lengkap"
              required
            />
            <Input
              id="nik"
              label="NIK"
              value={formData.nik}
              onChange={handleChange}
              placeholder="Masukkan 16 digit NIK"
              required
            />
            <Input
              id="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="johndoe@email.com"
              required
            />
            <Input
              id="telepon"
              label="No. Telepon (WhatsApp)"
              type="tel"
              value={formData.telepon}
              onChange={handleChange}
              placeholder="0812xxxxxxxx"
              required
            />
            <div className="md:col-span-2">
              <FormTextArea
                id="alamat"
                label="Alamat Lengkap"
                value={formData.alamat}
                onChange={handleChange}
                placeholder="Masukkan alamat lengkap"
                rows={3}
                required
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
              id="layanan"
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
            <Input
              id="tanggalKejadian"
              label="Tanggal Kejadian"
              type="date"
              value={formData.tanggalKejadian}
              onChange={handleChange}
              required
            />
            <div className="md:col-span-2">
              <Input
                id="judul"
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
                label="Lampiran Bukti (Opsional)"
                onChange={handleFileChange}
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
