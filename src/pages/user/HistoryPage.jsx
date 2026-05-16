import React, { useState } from "react";
import { ClipboardList, Eye, ShoppingBag, Package } from "lucide-react";
import { useHistoryLogic } from "../../hooks/user/useHistoryLogic";
import Button from "../../components/common/Button";
import OrderDetailModal from "../../components/forms/OrderDetailModal";

const HistoryPage = () => {
  const { orders, activeTab, setActiveTab, statuses, formatCurrency, handleStartShopping } = useHistoryLogic();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenDetail = (id) => {
    const order = orders.find((o) => o.id === id);
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "completed": return "bg-[#E8F5EE] text-[#2D5A43]";
      case "processing": return "bg-blue-50 text-blue-600";
      case "pending": return "bg-amber-50 text-amber-600";
      case "cancelled": return "bg-red-50 text-red-500";
      case "shipping": return "bg-orange-50 text-orange-500";
      default: return "bg-gray-50 text-gray-400";
    }
  };

  return (
    <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-gray-100 shadow-sm min-h-[600px]">
      <header className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-50">
        <div className="p-3 bg-[#E8F5EE] rounded-2xl">
          <Package size={22} className="text-[#2D5A43]" />
        </div>
        <div>
          <h3 className="text-xl font-black text-gray-900 tracking-tight">
            Riwayat <span className="text-[#2D5A43]">Pesanan.</span>
          </h3>
          <p className="text-sm text-gray-400 mt-0.5 font-medium">Pantau status dan riwayat belanja Anda</p>
        </div>
      </header>
      <div className="flex gap-2 mb-8 overflow-x-auto pb-3 scrollbar-hide -mx-4 px-4">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setActiveTab(status)}
            className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all duration-200 ${
              activeTab === status
                ? "bg-[#2D5A43] text-white shadow-lg shadow-[#2D5A43]/20"
                : "bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {orders.length > 0 ? (
          orders.map(({ id, created_at, status, items, total_amount }) => (
            <div
              key={id}
              className="border border-gray-100 rounded-[20px] overflow-hidden hover:border-gray-200 hover:shadow-lg hover:shadow-black/[0.03] transition-all duration-300"
            >
              <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 sm:justify-between bg-[#F8FAF9]/60 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="bg-[#2D5A43] p-2.5 rounded-xl text-white shadow-md shadow-[#2D5A43]/20">
                    <ClipboardList size={16} />
                  </div>
                  <div>
                    <p className="font-black text-[13px] text-gray-900 leading-none">{id}</p>
                    <p className="text-[11px] text-gray-400 font-medium mt-1">
                      {new Date(created_at).toLocaleDateString("id-ID", {
                        day: "numeric", month: "long", year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <span className={`text-[10px] px-3 py-1.5 rounded-xl font-black uppercase tracking-wider w-fit ${getStatusStyle(status)}`}>
                  {status}
                </span>
              </div>
              <div className="px-5 py-4 space-y-3">
                {items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#2D5A43]/20 shrink-0" />
                      <span className="text-[13px] text-gray-600 font-medium truncate">{item.name}</span>
                      <span className="text-[11px] text-gray-400 font-bold shrink-0">×{item.qty}</span>
                    </div>
                    <span className="text-[13px] font-black text-gray-900 ml-3 shrink-0">
                      {formatCurrency(item.price * item.qty)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="px-5 py-4 bg-[#F8FAF9]/40 border-t border-gray-50 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Total Pesanan</p>
                  <p className="text-lg font-black text-[#2D5A43] tracking-tight">{formatCurrency(total_amount)}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleOpenDetail(id)}
                    className="flex-1 sm:flex-none px-5 py-2.5 text-[11px] flex items-center justify-center gap-1.5"
                  >
                    <Eye size={14} /> Detail
                  </Button>
                  <Button
                    variant="primary"
                    className="flex-1 sm:flex-none px-5 py-2.5 text-[11px]"
                    onClick={() => console.log("Beli lagi")}
                  >
                    Beli Lagi
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-24 border-2 border-dashed border-gray-100 rounded-[24px]">
            <div className="p-7 bg-gray-50 rounded-full mb-5">
              <ShoppingBag size={36} className="text-gray-200" />
            </div>
            <h4 className="text-lg font-black text-gray-900 tracking-tight">Belum Ada Pesanan</h4>
            <p className="text-[13px] text-gray-400 max-w-[220px] mt-2 mb-8 leading-relaxed">
              Belum ada pesanan di kategori ini.
            </p>
            <Button variant="primary" onClick={handleStartShopping} className="px-8 py-3 text-[12px]">
              Mulai Belanja
            </Button>
          </div>
        )}
      </div>

      <OrderDetailModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formatCurrency={formatCurrency}
      />
    </div>
  );
};

export default HistoryPage;