/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import Input from "../../../components/Input";
import FormTextArea from "../../../components/FormTextArea";
import FormSelect from "../../../components/FormSelect";
import FormFileUpload from "../../../components/FormFileUpload";
import { FiSend } from "react-icons/fi";
import toast from "react-hot-toast";
import { useLoading } from "../../../context/LoadingContext";
import TicketSuccessModel from "../../../components/TicketSuccessModel";

import {
  getOpdList,
  getEmployeesByOpd,
  createServiceRequest,
} from "../services/newTicketService";
import { getServiceCatalog } from "../../request/services/requestService";
import { uploadToCloudinary } from "../../../services/storageServices";
import { CLOUDINARY_FOLDER_TICKET } from "../../../config";

const HelpdeskRequestForm = () => {
  const { showLoading, hideLoading } = useLoading();
  const fileInputRef = useRef(null);

  const [opdList, setOpdList] = useState([]);

  const [selectedOpd, setSelectedOpd] = useState("");
  const [pegawaiOptions, setPegawaiOptions] = useState([]);

  // State for dropdown option
  const [catalogOptions, setCatalogOptions] = useState([]);
  const [subLayananOptions, setSubLayananOptions] = useState([]);
  const [detailLayananOptions, setDetailLayananOptions] = useState([]);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdTicketId, setCreatedTicketId] = useState("");

  const [formData, setFormData] = useState({
    pemohonId: null,
    nama: "",
    nip: "",
    email: "",
    telepon: "",
    alamat: "",
    serviceCatalogId: "", // Level 1
    subCatalogId: "", // Level 2
    serviceItemId: "", // Level 3
    serviceDetailLabel: "",
    judul: "",
    deskripsi: "",
    tanggalPermintaan: new Date().toISOString().split("T")[0],
    lampiran: null,
  });

  // Fetch OPD List
  useEffect(() => {
    const fetchOpd = async () => {
      try {
        const data = await getOpdList();
        setOpdList(data);
      } catch (error) {
        console.error("Gagal mengambil list OPD.", error);
        toast.error("Gagal memuat daftar OPD");
      }
    };
    fetchOpd();
  }, []);

  // 2. Fetch Pegawai & Catalog when OPD has Choosen
  useEffect(() => {
    const loadDataByOpd = async () => {
      if (selectedOpd) {
        showLoading("Memuat data OPD...");
        try {
          const pegawaiData = await getEmployeesByOpd(selectedOpd);
          setPegawaiOptions(pegawaiData);

          const catalogsData = await getServiceCatalog(selectedOpd);
          setCatalogOptions(catalogsData);
        } catch (error) {
          console.error(error);
          toast.error("Gagal memuat data pegawai/katalog");
        } finally {
          hideLoading();
        }
      } else {
        setPegawaiOptions([]);
        setCatalogOptions([]);
      }
    };

    loadDataByOpd();

    // Reset fields
    setFormData((prev) => ({
      ...prev,
      pemohonId: null,
      nama: "",
      nip: "",
      email: "",
      telepon: "",
      alamat: "",
      serviceCatalogId: "",
      subCatalogId: "",
      serviceItemId: "",
    }));
  }, [selectedOpd]);

  /* Cascading Dropdown Logics */
  // Level 1 Selected -> Load Level 2
  useEffect(() => {
    if (formData.serviceCatalogId) {
      const selectedCat = catalogOptions.find(
        (c) => c.id == formData.serviceCatalogId
      );
      if (selectedCat && selectedCat.children) {
        setSubLayananOptions(selectedCat.children);
      } else {
        setSubLayananOptions([]);
      }
    } else {
      setSubLayananOptions([]);
    }
    setFormData((prev) => ({ ...prev, subCatalogId: "", serviceItemId: "" }));
  }, [formData.serviceCatalogId]);

  // Level 2 Selected -> Load Level 3
  useEffect(() => {
    if (formData.subCatalogId) {
      const selectedSub = subLayananOptions.find(
        (s) => s.id == formData.subCatalogId
      );
      if (selectedSub && selectedSub.children) {
        setDetailLayananOptions(selectedSub.children);
      } else {
        setDetailLayananOptions([]);
      }
    } else {
      setDetailLayananOptions([]);
    }
    setFormData((prev) => ({ ...prev, serviceItemId: "" }));
  }, [formData.subCatalogId]);

  // Auto fill if pegawai selected
  const handlePegawaiChange = (e) => {
    const pegawaiId = e.target.value;
    const pegawai = pegawaiOptions.find((p) => p.id == pegawaiId);
    if (pegawai) {
      setFormData((prev) => ({
        ...prev,
        pemohonId: pegawai.id,
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
    showLoading("Memproses permintaan...");

    try {
      let attachmentUrl = "";
      if (formData.lampiran) {
        toast.loading("Mengunggah lampiran...");
        attachmentUrl = await uploadToCloudinary(
          formData.lampiran,
          CLOUDINARY_FOLDER_TICKET
        );
        toast.dismiss();
      }

      const apiPayload = {
        title: formData.judul,
        description: formData.deskripsi,
        service_item_id: parseInt(formData.serviceItemId),
        service_detail: {
          kategori_utama: formData.serviceCatalogId,
          sub_kategori: formData.subCatalogId,
        },
        attachment_url: attachmentUrl,
        requested_date: formData.tanggalPermintaan,
      };

      const response = await createServiceRequest(apiPayload);

      const responseData = response?.data || response;
      const newTicketId =
        responseData?.ticket_number || responseData?.id || "-";

      setCreatedTicketId(newTicketId);
      setShowSuccessModal(true);

      setFormData({
        serviceCatalogId: "",
        subCatalogId: "",
        serviceItemId: "",
        serviceDetailLabel: "",
        judul: "",
        deskripsi: "",
        tanggalPermintaan: new Date().toISOString().split("T")[0],
        lampiran: null,
        pemohonId: null,
        nama: "",
        nip: "",
        email: "",
        telepon: "",
        alamat: "",
      });
      setSelectedOpd("");
      clearFile();
    } catch (error) {
      console.error("Gagal submit:", error);
      toast.error(`Gagal: ${error.message}`);
    } finally {
      hideLoading();
    }
  };

  return (
    <>
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
              {opdList.map((opd) => (
                <option key={opd.id} value={opd.id}>
                  {opd.name}
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
                  {p.full_name}
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
              id="serviceCatalogId"
              name="serviceCatalogId"
              label="Katalog Layanan"
              value={formData.serviceCatalogId}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                -- Pilih Kategori --
              </option>
              {catalogOptions.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </FormSelect>

            <FormSelect
              id="subCatalogId"
              name="subCatalogId"
              label="Jenis Tindakan"
              value={formData.subCatalogId}
              onChange={handleChange}
              required
              disabled={!formData.serviceCatalogId}
            >
              <option value="" disabled>
                -- Pilih Tindakan --
              </option>
              {subLayananOptions.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </FormSelect>

            <div className="md:col-span-2">
              <FormSelect
                id="serviceItemId"
                name="serviceItemId"
                label="Detail Layanan"
                value={formData.serviceItemId}
                onChange={handleChange}
                required
                disabled={!formData.subCatalogId}
              >
                <option value="" disabled>
                  -- Pilih Layanan Spesifik --
                </option>
                {detailLayananOptions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
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
                placeholder="Jelaskan kebutuhan secara detail..."
                rows={5}
                required
              />
            </div>
            <div className="md:col-span-2">
              <FormFileUpload
                id="lampiran"
                label="Lampiran (Opsional)"
                file={formData.lampiran}
                onChange={handleFileChange}
                onClear={clearFile}
                ref={fileInputRef}
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

      <TicketSuccessModel
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        ticketId={createdTicketId}
        title="Permintaan Diterima!"
        subTitle="Tiket permintaan layanan berhasil dibuat."
        footerMessage="* Silakan cek status penanganan melalui menu Manajemen Tiket."
      />
    </>
  );
};

export default HelpdeskRequestForm;
