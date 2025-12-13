import React, { useState, useEffect, useRef } from "react";
import Input from "../../../components/Input";
import FormTextArea from "../../../components/FormTextArea";
import FormSelect from "../../../components/FormSelect";
import FormFileUpload from "../../../components/FormFileUpload";
import { FiSend, FiUser, FiUsers } from "react-icons/fi";
import toast from "react-hot-toast";
import { useLoading } from "../../../context/LoadingContext";
import TicketSuccessModel from "../../../components/TicketSuccessModel";

import {
  getOpdList,
  getEmployeesByOpd,
  createIncident,
} from "../services/newTicketService";
import { createGuestIncident } from "../../complaint/services/ticketService";
import { uploadToCloudinary } from "../../../services/storageServices";
import { CLOUDINARY_FOLDER_TICKET } from "../../../config";

const HelpdeskComplaintForm = () => {
  const { showLoading, hideLoading } = useLoading();
  const [complainantType, setComplainantType] = useState("masyarakat");

  const [opdList, setOpdList] = useState([]);
  const [pegawaiOptions, setPegawaiOptions] = useState([]);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdTicketId, setCreatedTicketId] = useState("");

  const [selectedOpdPegawai, setSelectedOpdPegawai] = useState("");
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    pelaporId: null,
    nama: "",
    nip: "",
    email: "",
    telepon: "",
    layanan: "",
    alamat: "",
    namaOpd: "",
    namaAset: "",
    judul: "",
    deskripsi: "",
    tanggalKejadian: "",
    lokasiKejadian: "",
    lampiran: null,
  });

  // Fetch OPD List
  useEffect(() => {
    const fetchOpd = async () => {
      try {
        const data = await getOpdList();
        setOpdList(data);
      } catch (error) {
        console.error("gagal menampilkan list OPD", error);
        toast.error("Gagal memuat daftar OPD");
      }
    };
    fetchOpd();
  }, []);

  // 2. Fetch Pegawai if OPD has Choosen
  useEffect(() => {
    const fetchPegawai = async () => {
      if (complainantType === "pegawai" && selectedOpdPegawai) {
        showLoading("Memuat data pegawai...");
        try {
          const data = await getEmployeesByOpd(selectedOpdPegawai);
          setPegawaiOptions(data);
        } catch (error) {
          toast.error(error.message);
          setPegawaiOptions([]);
        } finally {
          hideLoading();
        }
      } else {
        setPegawaiOptions([]);
      }
    };

    fetchPegawai();

    // reset data complainant if Opd changed
    setFormData((prev) => ({
      ...prev,
      pelaporId: null,
      nama: "",
      nip: "",
      email: "",
      telepon: "",
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOpdPegawai, complainantType]);

  // Auto fill if pegawai selected
  const handlePegawaiChange = (e) => {
    const pegawaiId = e.target.value;

    const pegawai = pegawaiOptions.find((p) => p.id == pegawaiId);

    if (pegawai) {
      setFormData((prev) => ({
        ...prev,
        pelaporId: pegawai.id,
        nama: pegawai.full_name,
        nip: pegawai.nip,
        email: pegawai.email,
        telepon: pegawai.phone,
        alamat: pegawai.address,
      }));
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, lampiran: e.target.files[0] }));
  };

  const clearFile = () => {
    setFormData((prev) => ({ ...prev, lampiran: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    showLoading("Memproses tiket...");

    try {
      let attachmentUrl = "";
      if (formData.lampiran) {
        toast.loading("Mengunggah lampiran...", { id: "upload" });
        attachmentUrl = await uploadToCloudinary(
          formData.lampiran,
          CLOUDINARY_FOLDER_TICKET
        );
        toast.dismiss("upload");
      }

      let response;

      if (complainantType === "pegawai") {
        const internalPayload = {
          title: formData.judul,
          description: formData.deskripsi,
          category: formData.layanan,
          incident_location: formData.lokasiKejadian,
          incident_date: formData.tanggalKejadian,
          opd_id: parseInt(formData.namaOpd),
          asset_identifier: formData.namaAset,
          attachment_url: attachmentUrl,
          // Additional Field
          // reporter_id: formData.pelaporId
        };

        response = await createIncident(internalPayload);
      } else {
        // Masyarakat
        const publicPayload = {
          title: formData.judul,
          description: formData.deskripsi,
          category: formData.layanan,
          incident_location: formData.lokasiKejadian,
          incident_date: formData.tanggalKejadian,
          opd_id: parseInt(formData.namaOpd),
          asset_identifier: formData.namaAset,
          attachment_url: attachmentUrl,

          reporter_name: formData.nama,
          reporter_nik: formData.nip || "-",
          reporter_email: formData.email,
          reporter_phone: formData.telepon,
          reporter_address: formData.alamat,
        };

        response = await createGuestIncident(publicPayload);
      }

      const responseBody = response?.data || response;

      const newTicketId =
        responseBody?.ticket?.ticket_number ||
        responseBody?.data?.ticket_number ||
        responseBody?.ticket_number ||
        "-";

      console.log("Ticket ID Created:", newTicketId);

      setCreatedTicketId(newTicketId);
      setShowSuccessModal(true);

      setFormData({
        pelaporId: null,
        nama: "",
        nip: "",
        email: "",
        telepon: "",
        layanan: "",
        alamat: "",
        namaOpd: "",
        namaAset: "",
        judul: "",
        deskripsi: "",
        tanggalKejadian: "",
        lokasiKejadian: "",
        lampiran: null,
      });
      setSelectedOpdPegawai("");
      clearFile();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Gagal membuat tiket.");
    } finally {
      hideLoading();
    }
  };

  const isPegawai = complainantType === "pegawai";

  return (
    <>
      <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-700 pb-6">
          <h3 className="text-base md:text-lg font-medium leading-6 text-slate-900 bg-[#F7AD19] px-3 py-2 rounded-sm text-center dark:bg-[#916610] dark:text-white">
            Data Diri Pelapor (Atas Nama)
          </h3>
          <div className="mt-4 flex flex-col md:flex-row gap-4 dark:text-white">
            <button
              type="button"
              onClick={() => setComplainantType("masyarakat")}
              className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border-2 ${
                !isPegawai
                  ? "border-[#429EBD] bg-[#429EBD]/10"
                  : "border-slate-300 dark:border-slate-600 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
              }`}
            >
              <FiUser />
              <span>Masyarakat Umum</span>
            </button>
            <button
              type="button"
              onClick={() => setComplainantType("pegawai")}
              className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border-2 ${
                isPegawai
                  ? "border-[#429EBD] bg-[#429EBD]/10"
                  : "border-slate-300 dark:border-slate-600 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
              }`}
            >
              <FiUsers />
              <span>Pegawai OPD</span>
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {isPegawai && (
              <>
                <FormSelect
                  id="selectOpdPegawai"
                  label="Pilih OPD Pelapor"
                  value={selectedOpdPegawai}
                  onChange={(e) => setSelectedOpdPegawai(e.target.value)}
                >
                  <option value="">-- Pilih OPD --</option>
                  {opdList.map((opd) => (
                    <option key={opd.id} value={opd.id}>
                      {opd.name}
                    </option>
                  ))}
                </FormSelect>
                <FormSelect
                  id="selectPegawai"
                  label="Pilih Nama Pegawai"
                  disabled={!selectedOpdPegawai || pegawaiOptions.length === 0}
                  onChange={handlePegawaiChange}
                >
                  <option value="">-- Pilih Pegawai --</option>
                  {pegawaiOptions.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.full_name}
                    </option>
                  ))}
                </FormSelect>
              </>
            )}
            <Input
              id="nama"
              name="nama"
              label="Nama Lengkap"
              value={formData.nama}
              onChange={handleChange}
              placeholder={!isPegawai ? "Masukkan nama lengkap" : ""}
              required
              disabled={isPegawai}
            />
            <Input
              id="nip"
              name="nip"
              label={isPegawai ? "NIP" : "NIK"}
              value={formData.nip}
              onChange={handleChange}
              placeholder={!isPegawai ? "Masukkan 16 digit angka NIK" : ""}
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
              placeholder={!isPegawai ? "johndoe@email.com" : ""}
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
              placeholder={!isPegawai ? "0812xxxxxxxx" : ""}
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
                placeholder={!isPegawai ? "Masukkan alamat lengkap" : ""}
                rows={3}
                required
                disabled={isPegawai}
              />
            </div>
          </div>
        </div>

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
            >
              <option value="" disabled>
                -- Pilih OPD --
              </option>
              {opdList.map((opd) => (
                <option key={opd.id} value={opd.id}>
                  {opd.name}
                </option>
              ))}
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
              <option value="Hardware">Perangkat Keras (Hardware)</option>
              <option value="Software">Perangkat Lunak (Software)</option>
              <option value="Jaringan">Jaringan & Internet</option>
              <option value="Lainnya">Lainnya</option>
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
                placeholder="Jelaskan secara detail masalah yang dihadapi..."
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

          {/* Submit Button */}
          <div className="pt-6 flex justify-end">
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-3 md:px-6 py-2 md:py-3 rounded-lg font-semibold text-[#053F5C] bg-[#F7AD19] hover:bg-yellow-400"
            >
              <FiSend size={18} />
              <span>Buat Tiket</span>
            </button>
          </div>
        </div>
      </form>

      <TicketSuccessModel
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        ticketId={createdTicketId}
        title="Laporan Diterima!"
        subTitle="Tiket pengaduan berhasil dibuat dan masuk ke sistem."
        footerMessage="* Silakan cek status penanganan melalui menu Manajemen Tiket."
      />
    </>
  );
};

export default HelpdeskComplaintForm;
