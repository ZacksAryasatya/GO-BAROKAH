import React, { useState } from "react";
import {
  MapPin, Plus, Trash2, PencilLine, Loader2,
  Home, Briefcase, Map, Phone, User,
} from "lucide-react";
import AddressModal from "../../components/forms/AddressModal";
import ConfirmModal from "../../components/forms/ConfirmModal";
import { useAddressLogic } from "../../hooks/user/useAddressLogic";

const AddressPage = () => {
  const { addresses, isLoading, handleSaveAddress, handleDeleteAddress, handleSetDefault } = useAddressLogic();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, addressId: null });
  const [formData, setFormData] = useState({
    label: "", recipient_name: "", recipient_phone: "", address_detail: "", is_default: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getLabelIcon = (label) => {
    const l = label?.toLowerCase() || "";
    if (l.includes("rumah")) return <Home size={16} />;
    if (l.includes("kantor")) return <Briefcase size={16} />;
    return <Map size={16} />;
  };

  const openModal = (item = null) => {
    if (item) {
      setEditId(item.id || item._id);
      setFormData({
        label: item.label || "",
        recipient_name: item.recipientName || item.recipient_name || "",
        recipient_phone: item.recipientPhone || item.recipient_phone || "",
        address_detail: item.addressDetail || item.address_detail || "",
        is_default: item.isDefault || false,
      });
    } else {
      setEditId(null);
      setFormData({ label: "", recipient_name: "", recipient_phone: "", address_detail: "", is_default: false });
    }
    setIsModalOpen(true);
  };

  const openDeleteConfirm = (id) => setDeleteModal({ isOpen: true, addressId: id });

  const handleConfirmDelete = async () => {
    if (deleteModal.addressId) {
      await handleDeleteAddress(deleteModal.addressId);
      setDeleteModal({ isOpen: false, addressId: null });
    }
  };

  return (
    <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-gray-100 shadow-sm min-h-[600px]">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">
            Alamat <span className="text-[#3A5A4D]">Pengiriman.</span>
          </h3>
          <p className="text-sm text-gray-400 mt-1 font-medium">
            Atur ke mana pesanan Barokah Anda akan dikirim.
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-[#3A5A4D] hover:bg-[#2D463C] text-white px-5 py-3 rounded-2xl text-[11px] font-black tracking-widest transition-all active:scale-95 shadow-lg shadow-green-900/10 whitespace-nowrap w-full sm:w-auto justify-center"
        >
          <Plus size={16} /> TAMBAH ALAMAT
        </button>
      </header>
      <div className="grid grid-cols-1 gap-5">
        {isLoading ? (
          <div className="flex justify-center py-40">
            <Loader2 className="animate-spin text-[#3A5A4D]" size={32} />
          </div>
        ) : addresses.length > 0 ? (
          addresses.map((item) => {
            const itemId = item.id || item._id;
            const isDefault = item.isDefault || item.is_default || false;
            return (
              <div
                key={itemId}
                className={`group relative border rounded-[24px] p-6 transition-all duration-300 ${
                  isDefault
                    ? "border-[#3A5A4D] bg-[#FDFDFD] shadow-md shadow-green-900/5"
                    : "border-gray-100 hover:border-gray-300 bg-white"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${isDefault ? "bg-[#3A5A4D] text-white" : "bg-gray-100 text-gray-500"}`}>
                      {getLabelIcon(item.label)}
                    </div>
                    <span className="font-black text-[10px] uppercase tracking-[0.2em] text-gray-400">
                      {item.label || "Alamat"}
                    </span>
                    {isDefault && (
                      <span className="bg-[#E8F5EE] text-[#3A5A4D] text-[9px] px-3 py-1 rounded-lg font-black uppercase tracking-tighter">
                        Utama
                      </span>
                    )}
                  </div>
                </div>

                <div className="px-1 py-2 space-y-3">
                  <div className="flex items-center gap-4">
                    <User size={16} className="text-[#3A5A4D] opacity-40 shrink-0" />
                    <span className="text-[15px] font-bold text-gray-900">{item.recipientName || "-"}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Phone size={16} className="text-[#3A5A4D] opacity-40 shrink-0" />
                    <span className="text-[14px] text-gray-600 font-medium">{item.recipientPhone || "-"}</span>
                  </div>
                  <div className="flex items-start gap-4">
                    <MapPin size={16} className="text-[#3A5A4D] opacity-40 shrink-0 mt-0.5" />
                    <span className="text-[14px] text-gray-500 leading-relaxed font-medium">{item.addressDetail || "-"}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-5 border-t border-gray-50 gap-3">
                  {!isDefault ? (
                    <button
                      onClick={() => handleSetDefault(itemId)}
                      className="text-[11px] text-gray-400 hover:text-[#3A5A4D] font-bold uppercase tracking-widest transition-colors"
                    >
                      Jadikan Utama
                    </button>
                  ) : <div />}
                  <div className="flex gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => openModal(item)}
                      className="p-2.5 text-gray-400 hover:text-[#3A5A4D] hover:bg-gray-50 rounded-xl transition-all"
                    >
                      <PencilLine size={18} />
                    </button>
                    <button
                      onClick={() => openDeleteConfirm(itemId)}
                      className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-24 border-2 border-dashed border-gray-100 rounded-[32px]">
            <MapPin size={32} className="text-gray-200 mb-6" />
            <h4 className="text-lg font-bold text-gray-900">Belum ada alamat tersimpan</h4>
            <p className="text-sm text-gray-400 mt-2 max-w-[250px]">Tambahkan lokasi pengiriman untuk memudahkan checkout.</p>
          </div>
        )}
      </div>

      <AddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={async (e) => {
          e.preventDefault();
          if (await handleSaveAddress(formData, editId)) setIsModalOpen(false);
        }}
        formData={formData}
        onChange={handleInputChange}
        isEdit={!!editId}
        isLoading={isLoading}
      />

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, addressId: null })}
        onConfirm={handleConfirmDelete}
        isLoading={isLoading}
        title="Hapus Alamat?"
        message="Apakah Anda yakin ingin menghapus alamat ini? Data yang sudah dihapus tidak dapat dikembalikan."
      />
    </div>
  );
};

export default AddressPage;