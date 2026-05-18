import React, { useState, useMemo, useRef, useEffect } from "react";
import { Plus, ChevronLeft, ChevronRight, Pencil, Trash2, Package, Database, Loader2, Banknote, AlertCircle, Image as ImageIcon, Tag } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import InventoryStatCard from "../../components/admin/inventory/InventoryStatCard";
import ProductFilterBar from "../../components/admin/inventory/ProductFilterBar";
import ProductModal from "../../components/admin/inventory/ProductModal";
import ConfirmModal from "../../components/forms/ConfirmModal";
import { useAdminProducts } from "../../hooks/admin/useAdminProducts";
import { formatRupiah } from "../../utils/formatters";

const PER_PAGE = 10;

const AdminInventory = () => {
  const { products, categories, types, isLoading, actionLoading, handleCreate, handleUpdate, handleDelete, handleAddCategory, handleAddType, handleDeleteCategory, handleDeleteType } = useAdminProducts();

  const stats = useMemo(() => [
    { label: "Varian", value: products.length, icon: <Package size={16} />, iconBg: "bg-emerald-50 text-emerald-600" },
    { label: "Total Stok", value: products.reduce((a, p) => a + (Number(p.stock) || 0), 0).toLocaleString("id-ID"), icon: <Database size={16} />, iconBg: "bg-blue-50 text-blue-600" },
    { label: "Total harga produk", value: formatRupiah(products.reduce((a, p) => a + (Number(p.price) * Number(p.stock) || 0), 0)), icon: <Banknote size={16} />, iconBg: "bg-amber-50 text-amber-600" },
    { label: "Kosong", value: products.filter((p) => (Number(p.stock) || 0) <= 0).length, icon: <AlertCircle size={16} />, iconBg: "bg-red-50 text-red-600" },
  ], [products]);

  const [search, setSearch] = useState("");
  const [activecat, setActivecat] = useState("Semua");
  const [page, setPage] = useState(1);
  const [modalMode, setModalMode] = useState(null);
  const [selected, setSelected] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const tableScrollRef = useRef(null);

  useEffect(() => { setPage(1); }, [search, activecat]);

  useEffect(() => {
    const el = tableScrollRef.current;
    if (!el) return;
    const onScroll = () => setIsScrolled(el.scrollTop > 40);
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const filteredProducts = useMemo(() => products.filter((p) => {
    const pCategoryName = p.category?.name || p.category;
    return (activecat === "Semua" || pCategoryName === activecat) && p.name?.toLowerCase().includes(search.toLowerCase());
  }), [products, activecat, search]);

  const totalPages = Math.ceil(filteredProducts.length / PER_PAGE) || 1;
  const paginatedItems = filteredProducts.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const openModal = (mode, item = null) => { setSelected(item); setModalMode(mode); };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-shrink-0 bg-[#F8FAFC] transition-all duration-500 ease-in-out overflow-hidden" style={{ maxHeight: isScrolled ? "90px" : "450px" }}>
          <div className="flex items-center justify-between px-8 pt-8">
            <div className={`transition-all duration-500 ${isScrolled ? "opacity-0 -translate-y-10" : "opacity-100 translate-y-0"}`}>
              <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">Katalog Produk</h1>
              <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-[0.2em]">Sistem Inventaris UD BAROKAH</p>
            </div>
            <button onClick={() => openModal("create")} className="flex items-center gap-2 bg-[#1a4d2e] text-white px-5 py-3 rounded-xl text-[10px] font-black uppercase shadow-lg active:scale-95 transition-all">
              <Plus size={14} strokeWidth={3} />
              <span className={isScrolled ? "hidden" : "block"}>Produk Baru</span>
            </button>
          </div>
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 px-8 py-6 transition-all duration-500 ${isScrolled ? "opacity-0 scale-95 pointer-events-none -mb-[140px]" : "opacity-100 scale-100 mb-0"}`}>
            {stats.map((s) => <InventoryStatCard key={s.label} {...s} />)}
          </div>
          <div className={`px-8 py-2 transition-all duration-500 ${isScrolled ? "-translate-y-10" : "translate-y-0"}`}>
            <ProductFilterBar search={search} onSearchChange={setSearch} activecat={activecat} onCatChange={setActivecat} categories={categories} />
          </div>
        </div>

        <div className="flex-1 px-8 pb-8 flex flex-col min-h-0 mt-2">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-auto custom-scrollbar" ref={tableScrollRef}>
              <table className="w-full border-collapse min-h-full">
                <thead className="bg-slate-50/50 sticky top-0 backdrop-blur-md z-10 border-b border-slate-100">
                  <tr>
                    {["Produk", "Kategori", "Stok", "Harga", "Aksi"].map((h) => (
                      <th key={h} className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="py-24 text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-2" />
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Loading...</p>
                      </td>
                    </tr>
                  ) : paginatedItems.length > 0 ? (
                    <>
                      {paginatedItems.map((p) => {
                        const hasDiscount = p.discount_amount > 0 && p.final_price > 0 && p.final_price !== p.price;
                        return (
                          <tr key={p.id} className="hover:bg-slate-50/50 h-[73px]">
                            <td className="px-8 py-4">
                              <div className="flex items-center gap-4">
                                <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center">
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
                                  <p className="text-[9px] text-slate-400 font-bold uppercase">ID: {String(p.id).slice(-6)}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-4">
                              <span className="text-[9px] font-black text-blue-600 bg-blue-50/50 px-2.5 py-1.5 rounded-lg border border-blue-100/50 uppercase">
                                {p.category?.name || p.category}
                              </span>
                            </td>
                            <td className="px-8 py-4">
                              <div className="flex flex-col">
                                <span className={`font-black text-xs ${Number(p.stock) <= 5 ? "text-red-500" : "text-slate-700"}`}>{p.stock}</span>
                                <span className="text-[9px] text-slate-400 font-bold uppercase">{p.type?.name || p.unit}</span>
                              </div>
                            </td>
                            <td className="px-8 py-4">
                              <div className="flex flex-col gap-0.5">
                                {hasDiscount ? (
                                  <>
                                    <span className="text-slate-400 text-[10px] font-bold line-through leading-none">
                                      {formatRupiah(p.price)}
                                    </span>
                                    <span className="font-black text-xs text-red-500">
                                      {formatRupiah(p.final_price)}
                                    </span>
                                    <span className="flex items-center gap-1 mt-0.5">
                                      <Tag size={9} className="text-red-400" />
                                      <span className="text-[9px] font-black text-red-400 uppercase tracking-wider">
                                        Diskon {p.discount_amount}%
                                      </span>
                                    </span>
                                  </>
                                ) : (
                                  <span className="font-black text-slate-900 text-xs">
                                    {formatRupiah(p.price)}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-8 py-4">
                              <div className="flex gap-2">
                                <button onClick={() => openModal("edit", p)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-emerald-600 rounded-xl active:scale-90 transition-all">
                                  <Pencil size={14} />
                                </button>
                                <button onClick={() => openModal("delete", p)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-500 rounded-xl active:scale-90 transition-all">
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
            <footer className="px-8 py-4 border-t border-slate-50 flex items-center justify-between bg-white flex-shrink-0">
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
          onDeleteCategory={handleDeleteCategory}
          onDeleteType={handleDeleteType}
          onSubmit={modalMode === "create" ? handleCreate : (data) => handleUpdate(selected.id, data)}
        />
      )}
      {modalMode === "delete" && (
        <ConfirmModal
          isOpen={true}
          onClose={() => setModalMode(null)}
          onConfirm={async () => { const ok = await handleDelete(selected.id); if (ok) setModalMode(null); }}
          isLoading={actionLoading}
          title="Hapus Produk?"
          confirmText="Ya, Hapus Produk"
          message={`Apakah Anda yakin ingin menghapus "${selected?.name}"? Tindakan ini akan menghapus produk secara permanen dari stok UD BAROKAH.`}
        />
      )}
    </div>
  );
};

export default AdminInventory;