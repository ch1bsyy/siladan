/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import Input from "../../../components/Input";
import FormTextArea from "../../../components/FormTextArea";
import FormSelect from "../../../components/FormSelect";
import FormFileUpload from "../../../components/FormFileUpload";
import { FiSend } from "react-icons/fi";
import serviceCatalogData from "../services/catalogService";

const RequestForm = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    layanan: "",
    subLayanan: "",
    detailLayanan: "",
    judul: "",
    deskripsi: "",
    tanggalPermintaan: new Date().toISOString().split("T")[0],
    lampiran: null,
  });

  // State for dropdown option
  const [subLayananOptions, setSubLayananOptions] = useState([]);
  const [detailLayananOptions, setDetailLayananOptions] = useState([]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, lampiran: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Combine user data + form data
    const fullRequestData = {
      pemohon: {
        nama: user.name,
        nik: user.nik,
        telepon: user.phone,
        email: user.email,
        alamat: user.address,
        opd: user.opd.name,
      },
      permintaan: formData,
    };
    console.log("Data Formulir Permintaan:", fullRequestData);
    // Submit API Logic
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-lg shadow-xl overflow-hidden">
      <div className="p-6 sm:p-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-[#053F5C] dark:text-white">
          Formulir Permintaan Layanan
        </h2>
        <p className="mt-2 text-sm lg:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          "Silakan isi detail permintaan Anda pada form ini, kami akan segera
          menindaklanjutinya"
        </p>
      </div>

      <form onSubmit={handleSubmit} className="px-6 sm:px-10 pb-8 space-y-6">
        {/* Applicant's personal data (read-only) */}
        <div className="border-b border-slate-200 dark:border-slate-700 pb-6">
          <h3 className="text-base md:text-lg font-medium leading-6 text-slate-900 bg-[#F7AD19] px-3 py-2 rounded-sm text-center dark:bg-[#916610] dark:text-white">
            Data Diri Pemohon
          </h3>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <Input
              id="nama"
              label="Nama Lengkap"
              value={user.name || ""}
              disabled
            />
            <Input id="nik" label="NIK" value={user.nik || ""} disabled />
            <Input id="email" label="Email" value={user.email || ""} disabled />
            <Input
              id="telepon"
              type="tel"
              label="No. Telepon (WhatsApp)"
              value={user.phone_number || ""}
              disabled
            />
            <div className="md:col-span-2">
              <Input
                id="opd"
                label="Nama OPD"
                value={user.opd?.name || ""}
                disabled
              />
            </div>
            <div className="md:col-span-2">
              <FormTextArea
                id="alamat"
                label="Alamat Lengkap"
                value={user.address || ""}
                rows={3}
                disabled
              />
            </div>
          </div>
        </div>

        {/* Request details (editable) */}
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
                placeholder="Jelaskan kebutuhan Anda..."
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

        {/* Submit Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white bg-[#429EBD] hover:bg-[#053F5C] dark:bg-[#9FE7F5] dark:text-[#053F5C] dark:hover:bg-white transition-all duration-300 shadow-lg cursor-pointer"
          >
            <FiSend size={18} />
            <span>Kirim Permintaan</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default RequestForm;
