/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Input from "../../../components/Input";
import FormTextArea from "../../../components/FormTextArea";
import FormSelect from "../../../components/FormSelect";
import FormFileUpload from "../../../components/FormFileUpload";
import { FiSend } from "react-icons/fi";
import serviceCatalogData from "../../request/services/catalogService";

const mockOpdList = {
  inspektorat: "Inspektorat",
  sekretariat_dprd: "Sekretariat DPRD",
};
const mockPegawaiList = {
  inspektorat: [
    {
      id: 1,
      name: "Pegawai Inspektorat 1",
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
      phone: "+62895...",
      address: "Surabaya",
    },
    {
      id: 3,
      name: "Pegawai DPRD 2",
      nip: "222",
      email: "pegawai2@dprd.go.id",
      phone: "0822",
      address: "Surabaya",
    },
  ],
};

const HelpdeskRequestForm = () => {
  const [selectedOpd, setSelectedOpd] = useState("");
  const [pegawaiOptions, setPegawaiOptions] = useState([]);

  // State for dropdown option
  const [subLayananOptions, setSubLayananOptions] = useState([]);
  const [detailLayananOptions, setDetailLayananOptions] = useState([]);

  const [formData, setFormData] = useState({
    pemohonId: null,
    nama: "",
    nip: "",
    email: "",
    telepon: "",
    alamat: "",
    layanan: "",
    subLayanan: "",
    detailLayanan: "",
    judul: "",
    deskripsi: "",
    tanggalPermintaan: new Date().toISOString().split("T")[0],
    lampiran: null,
  });

  // Cascading Dropdown Logics
  useEffect(() => {
    if (formData.layanan) {
      setSubLayananOptions(
        Object.keys(serviceCatalogData[formData.layanan] || {})
      );
      setDetailLayananOptions([]);
      setFormData((prev) => ({
        ...prev,
        subLayanan: "",
        detailLayanan: "",
      }));
    } else {
      setSubLayananOptions([]);
      setDetailLayananOptions([]);
    }
  }, [formData.layanan]);

  // Update Service Details when Sub Service has changed
  useEffect(() => {
    if (formData.layanan && formData.subLayanan) {
      setDetailLayananOptions(
        serviceCatalogData[formData.layanan][formData.subLayanan] || []
      );
      setFormData((prev) => ({ ...prev, detailLayanan: "" }));
    } else {
      setDetailLayananOptions([]);
    }
  }, [formData.subLayanan]);

  // Effect load pegawai if opd selected
  useEffect(() => {
    if (selectedOpd) {
      setPegawaiOptions(mockPegawaiList[selectedOpd] || []);
    } else {
      setPegawaiOptions([]);
    }
    setFormData((prev) => ({
      ...prev,
      pemohonId: null,
      nama: "",
      nik: "",
      email: "",
      telepon: "",
      address: "",
    }));
  }, [selectedOpd]);

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

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, lampiran: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submit Permintaan:", formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-700 pb-6">
        <h3 className="text-base md:text-lg font-medium leading-6 text-slate-900 bg-[#F7AD19] px-3 py-2 rounded-sm text-center dark:bg-[#916610] dark:text-white">
          Data Diri Pemohon (Atas Nama Pegawai)
        </h3>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
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
          <Input
            id="nama"
            name="nama"
            label="Nama Lengkap"
            value={formData.nama}
            onChange={handleChange}
            required
            disabled
          />
          <Input
            id="nip"
            name="nip"
            label="NIP"
            value={formData.nip}
            onChange={handleChange}
            required
            disabled
          />
          <Input
            id="email"
            name="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled
          />
          <Input
            id="telepon"
            name="telepon"
            label="No. Telepon"
            type="tel"
            value={formData.telepon}
            onChange={handleChange}
            required
            disabled
          />
          <div className="md:col-span-2">
            <FormTextArea
              id="alamat"
              name="alamat"
              label="Alamat Lengkap"
              value={formData.alamat}
              onChange={handleChange}
              rows={3}
              required
              disabled
            />
          </div>
        </div>
      </div>

      {/* Request details */}
      <div>
        <h3 className="text-base md:text-lg font-medium leading-6 text-slate-900 bg-[#F7AD19] px-3 py-2 rounded-sm text-center dark:bg-[#916610] dark:text-white">
          Detail Permintaan Layanan
        </h3>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* Cascading Dropdowns */}
          <FormSelect
            id="layanan"
            name="layanan"
            label="Katalog Layanan"
            value={formData.layanan}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              -- Pilih Layanan --
            </option>
            {Object.keys(serviceCatalogData).map((layanan) => (
              <option key={layanan} value={layanan}>
                {layanan}
              </option>
            ))}
          </FormSelect>

          <FormSelect
            id="subLayanan"
            name="subLayanan"
            label="Sub Layanan"
            value={formData.subLayanan}
            onChange={handleChange}
            required
            disabled={!formData.layanan}
          >
            <option value="" disabled>
              -- Pilih Sub Layanan --
            </option>
            {subLayananOptions.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </FormSelect>

          <div className="md:col-span-2">
            <FormSelect
              id="detailLayanan"
              name="detailLayanan"
              label="Detail Layanan"
              value={formData.detailLayanan}
              onChange={handleChange}
              required
              disabled={!formData.subLayanan}
            >
              <option value="" disabled>
                -- Pilih Detail Layanan --
              </option>
              {detailLayananOptions.map((detail) => (
                <option key={detail} value={detail}>
                  {detail}
                </option>
              ))}
            </FormSelect>
          </div>

          <Input
            id="judul"
            label="Judul Permintaan"
            value={formData.judul}
            onChange={handleChange}
            placeholder="Contoh: Instalasi Microsoft Office 365"
            required
          />

          <Input
            id="tanggalPermintaan"
            label="Tanggal Permintaan"
            type="date"
            value={formData.tanggalPermintaan}
            onChange={handleChange}
            required
          />

          <div className="md:col-span-2">
            <FormTextArea
              id="deskripsi"
              label="Deskripsi Permintaan"
              value={formData.deskripsi}
              onChange={handleChange}
              placeholder="Jelaskan kebutuhan..."
              rows={5}
              required
            />
          </div>
          <div className="md:col-span-2">
            <FormFileUpload
              id="lampiran"
              label="Lampiran (Opsional)"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white bg-[#429EBD] hover:bg-[#053F5C]"
        >
          <FiSend size={18} />
          <span>Buat Tiket</span>
        </button>
      </div>
    </form>
  );
};

export default HelpdeskRequestForm;
