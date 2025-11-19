/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useLoading } from "../../../context/LoadingContext";
import toast from "react-hot-toast";
import TicketSuccessModel from "../../../components/TicketSuccessModel";

import Input from "../../../components/Input";
import FormTextArea from "../../../components/FormTextArea";
import FormSelect from "../../../components/FormSelect";
import FormFileUpload from "../../../components/FormFileUpload";
import { FiSend } from "react-icons/fi";

import {
  getServiceCatalog,
  createServiceRequest,
} from "../services/requestService";
import { uploadToCloudinary } from "../../../services/storageServices";

const RequestForm = () => {
  const { user } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  // const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdTicketId, setCreatedTicketId] = useState("");

  const [formData, setFormData] = useState({
    serviceCatalogId: "",
    subCatalogId: "",
    serviceItemId: "",
    serviceDetailLabel: "",
    judul: "",
    deskripsi: "",
    tanggalPermintaan: new Date().toISOString().split("T")[0],
    lampiran: null,
  });

  // State for store data from API
  const [catalogOptions, setCatalogOptions] = useState([]);
  // State for fill dropdown option
  const [layananOptions, setLayananOptions] = useState([]);
  const [subLayananOptions, setSubLayananOptions] = useState([]);
  const [detailLayananOptions, setDetailLayananOptions] = useState([]);

  // Take Catalog Data from API
  useEffect(() => {
    const fetchCatalog = async () => {
      if (!user) return;

      if (!user?.opd_id) {
        toast.error("Gagal memuat katalog: OPD user tidak ditemukan.");
        return;
      }

      try {
        const catalogs = await getServiceCatalog(user.opd_id);
        setCatalogOptions(catalogs);
        console.log("daftar katalog:", catalogs);

        const level1Options = catalogs.map((cat) => ({
          id: cat.id,
          label: cat.catalog_name,
        }));
        setLayananOptions(level1Options);
      } catch (error) {
        toast.error(`Gagal memuat katalog: ${error.message}`);
      }
    };

    fetchCatalog();
  }, [user]);

  // Cascading Dropdown Logics
  useEffect(() => {
    let options = [];
    if (formData.serviceCatalogId) {
      const selectedCatalog = catalogOptions.find(
        (cat) => cat.id.toString() === formData.serviceCatalogId
      );
      if (selectedCatalog && selectedCatalog.sub_layanan) {
        options = selectedCatalog.sub_layanan.map((sub) => ({
          id: sub.id,
          label: sub.sub_catalog_name,
        }));
      }
    }
    setSubLayananOptions(options);
    setDetailLayananOptions([]);
    setFormData((prev) => ({
      ...prev,
      subCatalogId: "",
      serviceItemId: "",
      serviceDetailLabel: "",
    }));
  }, [formData.serviceCatalogId]);

  // Update Service Details when Sub Service has changed
  useEffect(() => {
    let options = [];
    if (formData.serviceCatalogId && formData.subCatalogId) {
      const selectedCatalog = catalogOptions.find(
        (cat) => cat.id.toString() === formData.serviceCatalogId
      );
      const selectedSub = selectedCatalog?.sub_layanan.find(
        (sub) => sub.id.toString() === formData.subCatalogId
      );

      if (selectedSub && selectedSub.service_items) {
        options = selectedSub.service_items.map((item) => ({
          id: item.id,
          label: item.item_name,
        }));
      }
    }
    setDetailLayananOptions(options);
    setFormData((prev) => ({
      ...prev,
      serviceItemId: "",
      serviceDetailLabel: "",
    }));
  }, [formData.subCatalogId]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDetailLayananChange = (e) => {
    const selectedId = e.target.value;
    const selectedOption = detailLayananOptions.find(
      (opt) => opt.id.toString() === selectedId
    );

    setFormData((prev) => ({
      ...prev,
      serviceItemId: selectedId,
      serviceDetailLabel: selectedOption ? selectedOption.label : "",
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5MB");
      e.target.value = null;
      return;
    }
    setFormData((prev) => ({ ...prev, lampiran: file || null }));
  };

  const clearFile = () => {
    setFormData((prev) => ({ ...prev, lampiran: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    showLoading("Mengirim permintaan...");

    try {
      let attachmentUrl = "";
      if (formData.lampiran) {
        toast.loading("Mengunggah lampiran");
        attachmentUrl = await uploadToCloudinary(formData.lampiran);
        toast.dismiss();
      }

      const apiPayload = {
        title: formData.judul,
        description: formData.deskripsi,
        service_item_id: parseInt(formData.serviceItemId, 10),
        service_detail: {
          permintaan: formData.serviceDetailLabel,
        },
        requested_date: formData.tanggalPermintaan,
        attachment_url: attachmentUrl || null,
      };

      console.log("Mengirim Payload Permintaan:", apiPayload);

      const response = await createServiceRequest(apiPayload);

      hideLoading();

      const responseData = response?.ticket || response;
      const ticketId = responseData?.ticket_number || "-";

      setCreatedTicketId(ticketId);
      setShowSuccessModal(true);

      setFormData({
        serviceCatalogId: "",
        subCatalogId: "",
        serviceItemId: "",
        judul: "",
        deskripsi: "",
        tanggalPermintaan: new Date().toISOString().split("T")[0],
        lampiran: null,
      });
      clearFile();
    } catch (error) {
      console.error("Gagal submit permintaan:", error);
      hideLoading();
      toast.error(`Gagal mengirim: ${error.message || "Silakan coba lagi."}`);
    }
  };

  return (
    <>
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
                value={user.full_name || ""}
                disabled
              />
              <Input id="nip" label="NIP" value={user.nip || ""} disabled />
              <Input
                id="email"
                label="Email"
                value={user.email || ""}
                disabled
              />
              <Input
                id="telepon"
                type="tel"
                label="No. Telepon (WhatsApp)"
                value={user.phone || ""}
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
                name="serviceCatalogId"
                label="Katalog Layanan"
                value={formData.serviceCatalogId}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  -- Pilih Layanan --
                </option>
                {layananOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </FormSelect>

              <FormSelect
                id="subLayanan"
                name="subCatalogId"
                label="Sub Layanan"
                value={formData.subCatalogId}
                onChange={handleChange}
                required
                disabled={subLayananOptions.length === 0}
              >
                <option value="" disabled>
                  -- Pilih Sub Layanan --
                </option>
                {subLayananOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </FormSelect>

              <div className="md:col-span-2">
                <FormSelect
                  id="detailLayanan"
                  name="serviceItemId"
                  label="Detail Layanan"
                  value={formData.serviceItemId}
                  onChange={handleDetailLayananChange}
                  required
                  disabled={detailLayananOptions.length === 0}
                >
                  <option value="" disabled>
                    -- Pilih Detail Layanan --
                  </option>
                  {detailLayananOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </FormSelect>
              </div>

              <Input
                id="judul"
                label="Judul Permintaan"
                value={formData.judul}
                onChange={handleChange}
                placeholder="Contoh: Permintaan Reset Password Email"
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
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white bg-[#429EBD] hover:bg-[#053F5C] dark:bg-[#9FE7F5] dark:text-[#053F5C] dark:hover:bg-white transition-all duration-300 shadow-lg cursor-pointer"
            >
              <FiSend size={18} />
              <span>Kirim Permintaan</span>
            </button>
          </div>
        </form>
      </div>

      <TicketSuccessModel
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        ticketId={createdTicketId}
        title="Permintaan Diterima!"
        subTitle="Terima kasih telah mengajukan permintaan. Permintaan Anda telah masuk ke sistem dengan informasi tiket:"
        footerMessage="*Silakan cek status penanganan melalui menu Lacak Tiket."
      />
    </>
  );
};

export default RequestForm;
