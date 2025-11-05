import React, { useState, useEffect } from "react";
import Input from "../../../components/Input";
import FormTextArea from "../../../components/FormTextArea";
import FormSelect from "../../../components/FormSelect";
import FormFileUpload from "../../../components/FormFileUpload";
import { FiSend, FiUser, FiUsers } from "react-icons/fi";

const mockOpdList = {
  inspektorat: "Inspektorat",
  sekretariat_dprd: "Sekretariat DPRD",
};

const mockPegawaiList = {
  inspektorat: [
    {
      id: 1,
      name: "Pegawai Inspektorat A",
      nip: "111",
      email: "pegawai1@inspektorat.go.id",
      phone: "0811",
      address: "Surabaya",
    },
  ],
  sekretariat_dprd: [
    {
      id: 2,
      name: "Bisma Pargoy",
      nip: "1471070904020021",
      email: "pegawai@opd.go.id",
      phone: "+62895",
      address: "Surabaya",
    },
    {
      id: 3,
      name: "Pegawai DPRD B",
      nik: "222",
      email: "pegawai2@dprd.go.id",
      phone: "0822",
      address: "Surabaya",
    },
  ],
};

const HelpdeskComplaintForm = () => {
  const [complainantType, setComplainantType] = useState("masyarakat");
  const [selectedOpd, setSelectedOpd] = useState("");
  const [pegawaiOptions, setPegawaiOptions] = useState([]);

  const [formData, setFormData] = useState({
    pelaporId: null,
    nama: "",
    nip: "",
    email: "",
    telepon: "",
    layanan: "",
    alamat: "",
    namaOpd: "", // OPD Asset
    namaAset: "",
    judul: "",
    deskripsi: "",
    tanggalKejadian: "",
    lokasiKejadian: "",
    lampiran: null,
  });

  // Effect pegawai list by OPD
  useEffect(() => {
    if (complainantType === "pegawai" && selectedOpd) {
      setPegawaiOptions(mockPegawaiList[selectedOpd] || []);
    } else {
      setPegawaiOptions([]);
    }

    // reset data complainant if Opd changed
    setFormData((prev) => ({
      ...prev,
      pelaporId: null,
      nama: "",
      nip: "",
      email: "",
      telepon: "",
    }));
  }, [selectedOpd, complainantType]);

  // Auto fill if pegawai selected
  const handlePegawaiChange = (e) => {
    const pegawaiId = e.target.value;
    const pegawai = pegawaiOptions.find((p) => p.id.toString() === pegawaiId);
    if (pegawai) {
      setFormData((prev) => ({
        ...prev,
        pelaporId: pegawai.id,
        nama: pegawai.name,
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submit Pengaduan", formData);
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, lampiran: e.target.files[0] }));
  };

  const isPegawai = complainantType === "pegawai";

  return (
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
                id="selectOpd"
                label="Pilih OPD Pegawai"
                value={selectedOpd}
                onChange={(e) => setSelectedOpd(e.target.value)}
              >
                <option value="">-- Pilih OPD --</option>
                {Object.entries(mockOpdList).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </FormSelect>
              <FormSelect
                id="selectPegawai"
                label="Pilih Pegawai"
                disabled={!selectedOpd || pegawaiOptions.length === 0}
                onChange={handlePegawaiChange}
              >
                <option value="">-- Pilih Pegawai --</option>
                {pegawaiOptions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
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
          {!isPegawai && (
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
          )}
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
          <div className={isPegawai ? "md:col-span-1" : "md:col-span-2"}>
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
              onChange={handleFileChange}
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
  );
};

export default HelpdeskComplaintForm;
