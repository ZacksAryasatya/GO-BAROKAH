import React, { useState, useMemo, useRef, useEffect } from "react";
import { Plus, ChevronLeft, ChevronRight, Pencil, Trash2, Package, Database, Loader2, Banknote, AlertCircle, Image as ImageIcon, Tag, Eye, EyeOff, Menu } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import InventoryStatCard from "../../components/admin/inventory/InventoryStatCard";
import ProductFilterBar from "../../components/admin/inventory/ProductFilterBar";
import ProductModal from "../../components/admin/inventory/ProductModal";
import ConfirmModal from "../../components/forms/ConfirmModal";
import { useAdminProducts } from "../../hooks/admin/useAdminProducts";
import { formatRupiah } from "../../utils/formatters";

const PER_PAGE = 10;

const AdminInventory = () => {
  const { 
    products, categories, types, isLoading, actionLoading, 
    handleCreate, handleUpdate, handleDelete, handleToggleActive,
    handleAddCategory, handleAddType, 
    handleEditCategory, handleEditType 
  } = useAdminProducts();

  const stats = useMemo(() => {
    const needRestockProducts = products.filter(p => (Number(p.stock) || 0) <= 10);
    const availableProducts = products.filter(p => (Number(p.stock) || 0) > 10);

    return [
      { 
        label: "Perlu Restock", 
        value: needRestockProducts.length, 
        icon: <AlertCircle size={16} />, 
        iconBg: "bg-red-50 text-red-600",
        items: needRestockProducts 
      },
      { 
        label: "Stok Tersedia", 
        value: availableProducts.length, 
        icon: <Package size={16} />, 
        iconBg: "bg-emerald-50 text-emerald-600",
        items: availableProducts
      },
    ];
  }, [products]);

  const [search, setSearch] = useState("");
  const [activecat, setActivecat] = useState("Semua");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [modalMode, setModalMode] = useState(null);
  const [selected, setSelected] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const tableScrollRef = useRef(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  useEffect(() => { setPage(1); }, [search, activecat]);

  useEffect(() => {
    const el = tableScrollRef.current;
    if (!el) return;
    const onScroll = () => setIsScrolled(el.scrollTop > 40);
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (tableScrollRef.current) {
      tableScrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [page]);

  const filteredProducts = useMemo(() => products.filter((p) => {
    const pCategoryName = p.category?.name || p.category;
    return (activecat === "Semua" || pCategoryName === activecat) && p.name?.toLowerCase().includes(search.toLowerCase());
  }), [products, activecat, search]);

  const totalPages = Math.ceil(filteredProducts.length / PER_PAGE) || 1;
  const paginatedItems = filteredProducts.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const openModal = (mode, item = null) => { setSelected(item); setModalMode(mode); };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      <AdminSidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-shrink-0 bg-[#F8FAFC] relative z-50">
          <div className="flex items-center justify-between px-4 md:px-8 pt-4 md:pt-8 relative z-20 bg-[#F8FAFC]">
            <div className="flex items-center gap-3 md:gap-0">
              <button className="md:hidden p-2 -ml-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-[#1a4d2e] relative z-50" onClick={() => setIsMobileOpen(true)}>
                <Menu size={20} />
              </button>
              <div className="transition-all duration-500">
                <h1 className="text-lg md:text-xl font-black text-slate-900 tracking-tight uppercase">Inventaris</h1>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-[0.2em] hidden md:block">Sistem Inventaris UD BAROKAH</p>
              </div>
            </div>
            <button onClick={() => openModal("create")} className="flex items-center gap-2 bg-[#1a4d2e] text-white px-4 md:px-5 py-2.5 md:py-3 rounded-xl text-[10px] font-black uppercase shadow-lg active:scale-95 transition-all">
              <Plus size={14} strokeWidth={3} />
              <span className={isScrolled ? "hidden md:block" : "block"}>Produk Baru</span>
            </button>
          </div>
          <div 
            className={`transition-all duration-500 ease-in-out ${isScrolled ? 'overflow-hidden' : 'overflow-visible relative z-40'}`}
            style={{ maxHeight: isScrolled ? "0px" : "500px", opacity: isScrolled ? 0 : 1 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 px-4 md:px-8 py-4 md:py-6">
                {stats.map((s) => <InventoryStatCard key={s.label} {...s} />)}
            </div>
          </div>
          <div className="relative z-20 px-4 md:px-8 py-2 bg-[#F8FAFC]">
            <ProductFilterBar search={search} onSearchChange={setSearch} activecat={activecat} onCatChange={setActivecat} categories={categories} />
          </div>
        </div>

        <div className="relative z-10 flex-1 px-4 md:px-8 pb-4 md:pb-8 flex flex-col min-h-0 mt-2">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-auto custom-scrollbar" ref={tableScrollRef}>
              <table className="w-full border-collapse min-h-full min-w-[700px]">
                <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-100">
                  <tr>
                    {["ID", "Produk", "Kategori", "Stok", "Harga", "Aksi"].map((h) => (
                      <th key={h} className={`px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ${h === 'Aksi' ? 'text-right' : 'text-left'}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="py-24 text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-2" />
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Loading...</p>
                      </td>
                    </tr>
                  ) : paginatedItems.length > 0 ? (
                    <>
                      {paginatedItems.map((p) => {
                        const hasDiscount = p.discount_amount > 0 && p.final_price > 0 && p.final_price !== p.price;
                        return (
                          <tr key={p.id} className={`hover:bg-slate-50/50 h-[73px] transition-colors ${!p.is_active ? "opacity-50 grayscale" : ""}`}>
                            <td className="px-4 py-4">
                              <span className="text-[10px] font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md whitespace-nowrap">
                                #{p.id}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-4">
                                <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center relative">
                                  {!p.is_active && (
                                    <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center z-10">
                                      <EyeOff size={16} className="text-white" />
                                    </div>
                                  )}
                                  {p.image_url || p.image ? (
                                    <img
                                      src={p.image_url || p.image}
                                      alt={p.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => { e.target.src = "https://placehold.co/400x400/FBFBFB/3A5A4D?text=No+Image"; }}
                                    />
                                  ) : (
                                    <ImageIcon size={18} className="text-slate-300" />
                                  )}
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <p className="font-bold text-slate-900 text-xs uppercase truncate">{p.name}</p>
                                  <p className="text-[9px] text-slate-400 font-medium truncate w-40">{p.description || "No description available"}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span className="text-[9px] font-black text-blue-600 bg-blue-50/50 px-2.5 py-1.5 rounded-lg border border-blue-100/50 uppercase">
                                {p.category?.name || p.category}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex flex-col">
                                <span className={`font-black text-xs ${Number(p.stock) <= 5 ? "text-red-500" : "text-slate-700"}`}>{p.stock}</span>
                                <span className="text-[9px] text-slate-400 font-bold uppercase">{p.type?.name || p.unit}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex flex-col gap-0.5">
                                {hasDiscount ? (
                                  <>
                                    <span className="text-red-400 text-[10px] font-bold line-through leading-none">
                                      {formatRupiah(p.price)}
                                    </span>
                                    <span className="font-black text-xs text-slate-900">
                                      {formatRupiah(p.final_price)}
                                    </span>
                                    <span className="flex items-center gap-1 mt-0.5">
                                      <Tag size={9} className="text-emerald-500" />
                                      <span className="text-[9px] font-black text-emerald-500 uppercase tracking-wider">
                                        Diskon {p.discount_amount}%
                                      </span>
                                    </span>
                                  </>
                                ) : (
                                  <span className="font-black text-slate-900 text-xs">
                                    {formatRupiah(p.price)}
                                  </span>
                                )}
                                <span className="text-[9px] text-slate-400 font-bold uppercase mt-1">
                                  Modal: {formatRupiah(p.cost || 0)}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => handleToggleActive(p.id)} 
                                  className={`p-2.5 rounded-xl active:scale-90 transition-all ${
                                    p.is_active 
                                      ? "bg-slate-50 text-slate-400 hover:text-orange-500" 
                                      : "bg-orange-50 text-orange-500 hover:text-orange-600"
                                  }`}
                                  title={p.is_active ? "Sembunyikan Produk" : "Tampilkan Produk"}
                                >
                                  {p.is_active ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                                <button onClick={() => openModal("edit", p)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-emerald-600 rounded-xl active:scale-90 transition-all">
                                  <Pencil size={14} />
                                </button>
                                <button onClick={() => setDeleteModal({ isOpen: true, id: p.id })} className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-500 rounded-xl active:scale-90 transition-all">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {paginatedItems.length < PER_PAGE && (
                        <tr style={{ height: `${(PER_PAGE - paginatedItems.length) * 73}px` }}>
                          <td colSpan={5} />
                        </tr>
                      )}
                    </>
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-24 text-center uppercase tracking-widest text-slate-300 font-black text-[10px]">Kosong</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <footer className="px-4 md:px-8 py-4 border-t border-slate-50 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white flex-shrink-0">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Page {page} of {totalPages}</p>
              <div className="flex gap-1.5">
                <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 disabled:opacity-20 active:scale-95 transition-all">
                  <ChevronLeft size={16} />
                </button>
                <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 disabled:opacity-20 active:scale-95 transition-all">
                  <ChevronRight size={16} />
                </button>
              </div>
            </footer>
          </div>
        </div>
      </div>

      {(modalMode === "create" || modalMode === "edit") && (
        <ProductModal
          mode={modalMode}
          initial={selected}
          categories={categories}
          types={types}
          onClose={() => setModalMode(null)}
          onAddCategory={handleAddCategory}
          onAddType={handleAddType}
          onEditCategory={handleEditCategory} 
          onEditType={handleEditType}
          onSubmit={modalMode === "create" ? handleCreate : (data) => handleUpdate(selected?.id, data)}
        />
      )}

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={() => {
          handleDelete(deleteModal.id);
          setDeleteModal({ isOpen: false, id: null });
        }}
        title="Hapus Produk"
        message="Apakah kamu yakin ingin menghapus produk ini? Semua data terkait produk ini akan ikut terhapus secara permanen."
        isLoading={actionLoading}
      />

    </div>
  );
};

export default AdminInventory;