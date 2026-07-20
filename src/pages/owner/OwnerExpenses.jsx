import React, { useState, useMemo, useRef, useEffect } from "react";
import { Plus, ChevronLeft, ChevronRight, Pencil, Trash2, Receipt, Search, Loader2 } from "lucide-react";
import OwnerSidebar from "../../components/owner/OwnerSidebar";
import ExpenseModal from "../../components/owner/expenses/ExpenseModal";
import ConfirmModal from "../../components/forms/ConfirmModal";
import { useOwnerExpenses } from "../../hooks/owner/useOwnerExpenses";
import { formatIDR } from "../../utils/formatCurrency";

const PER_PAGE = 10;

const OwnerExpenses = () => {
  const { 
    expenses, isLoading, actionLoading, 
    fetchExpenses, handleCreate, handleUpdate, handleDelete 
  } = useOwnerExpenses();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalMode, setModalMode] = useState(null); 
  const [selected, setSelected] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const tableScrollRef = useRef(null);
  
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  useEffect(() => { setPage(1); }, [search]);

  useEffect(() => {
    const el = tableScrollRef.current;
    if (!el) return;
    const onScroll = () => setIsScrolled(el.scrollTop > 40);
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const filteredExpenses = useMemo(() => {
    if (!expenses) return [];
    return expenses.filter(e => 
      e.description?.toLowerCase().includes(search.toLowerCase()) ||
      e.category?.toLowerCase().includes(search.toLowerCase())
    ).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [expenses, search]);

  const totalPages = Math.ceil(filteredExpenses.length / PER_PAGE) || 1;
  const paginated = filteredExpenses.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const getCategoryLabel = (cat) => {
    const categories = {
      SALARY: "Gaji", RENT: "Sewa", UTILITIES: "Utilitas", 
      DEPRECIATION: "Penyusutan", TAX: "Pajak", OTHER: "Lainnya"
    };
    return categories[cat] || cat;
  };

  const getCategoryColor = (cat) => {
    const colors = {
      SALARY: "bg-blue-50 text-blue-600 border-blue-200",
      RENT: "bg-purple-50 text-purple-600 border-purple-200",
      UTILITIES: "bg-orange-50 text-orange-600 border-orange-200",
      DEPRECIATION: "bg-slate-100 text-slate-600 border-slate-200",
      TAX: "bg-red-50 text-red-600 border-red-200",
      OTHER: "bg-emerald-50 text-emerald-600 border-emerald-200"
    };
    return colors[cat] || "bg-gray-50 text-gray-600 border-gray-200";
  };

  const LoadingSkeleton = () => (
    <div className="flex h-screen bg-[#F8FAFC]">
      <OwnerSidebar />
      <main className="flex-1 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">
          Memuat data pengeluaran...
        </p>
      </main>
    </div>
  );

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden text-[13px]">
      <OwnerSidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-5 flex items-center justify-between z-10 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-black tracking-tighter text-slate-800 uppercase leading-none">Pengeluaran</h2>
            <p className="text-[10px] text-slate-400 font-black mt-1.5 uppercase tracking-[0.2em]">Manajemen Operasional</p>
          </div>
          <button 
            onClick={() => { setModalMode("add"); setSelected(null); }}
            className="flex items-center gap-2 bg-[#1a4d2e] hover:bg-[#133d23] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-[#1a4d2e]/20"
          >
            <Plus size={16} />
            <span className="uppercase tracking-wider">Tambah Data</span>
          </button>
        </header>

        <div className="p-8 flex-1 flex flex-col overflow-hidden">
          {/* Filter Bar */}
          <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm mb-6 flex items-center transition-all focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500/20">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Cari berdasarkan deskripsi atau kategori..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-transparent border-transparent focus:border-transparent focus:ring-0 outline-none text-xs font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-medium shadow-none"
              />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden relative">
            <div className={`absolute top-0 left-0 right-0 h-14 bg-white/80 backdrop-blur-md z-10 border-b transition-colors duration-300 ${isScrolled ? "border-slate-200" : "border-transparent"}`}>
              <div className="flex h-full items-center px-6">
                <div className="w-[30%] text-[10px] font-black text-slate-400 uppercase tracking-widest">Deskripsi</div>
                <div className="w-[20%] text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Kategori</div>
                <div className="w-[15%] text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Tanggal</div>
                <div className="w-[20%] text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Nominal</div>
                <div className="w-[15%] text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</div>
              </div>
            </div>

            <div ref={tableScrollRef} className="flex-1 overflow-y-auto custom-scrollbar pt-14">
              {paginated.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {paginated.map((exp) => (
                    <div key={exp.id} className="flex items-center px-6 py-4 hover:bg-slate-50/80 transition-colors group">
                      <div className="w-[30%]">
                        <p className="text-xs font-bold text-slate-800 line-clamp-2 pr-4">{exp.description}</p>
                      </div>
                      
                      <div className="w-[20%] flex justify-center">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${getCategoryColor(exp.category)}`}>
                          {getCategoryLabel(exp.category)}
                        </span>
                      </div>

                      <div className="w-[15%] flex justify-center">
                        <p className="text-xs font-bold text-slate-500">
                          {new Date(exp.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>

                      <div className="w-[20%] flex justify-end">
                        <p className="text-xs font-black text-slate-800">{formatIDR(exp.amount)}</p>
                      </div>

                      <div className="w-[15%] flex justify-end gap-2">
                        <button 
                          onClick={() => { setModalMode("edit"); setSelected(exp); }}
                          className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 transition-all"
                        >
                          <Pencil size={14} />
                        </button>
                        <button 
                          onClick={() => setDeleteModal({ isOpen: true, id: exp.id })}
                          className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    BELUM ADA PENGELUARAN
                  </span>
                </div>
              )}
            </div>

            <div className="px-8 py-4 border-t border-slate-50 flex items-center justify-between bg-white flex-shrink-0">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                PAGE {page} OF {totalPages || 1}
              </p>
              <div className="flex gap-1.5">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-lg border border-slate-100 hover:bg-slate-50 disabled:opacity-20 transition-all shadow-sm active:scale-95">
                  <ChevronLeft size={16} />
                </button>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages || totalPages === 0} className="p-2 rounded-lg border border-slate-100 hover:bg-slate-50 disabled:opacity-20 transition-all shadow-sm active:scale-95">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {modalMode && (
        <ExpenseModal 
          mode={modalMode} 
          initial={selected} 
          onClose={() => { setModalMode(null); setSelected(null); }} 
          onSubmit={modalMode === "add" ? handleCreate : (data) => handleUpdate(selected.id, data)}
        />
      )}

      {deleteModal.isOpen && (
        <ConfirmModal 
          isOpen={deleteModal.isOpen} 
          onClose={() => setDeleteModal({ isOpen: false, id: null })} 
          onConfirm={() => { handleDelete(deleteModal.id); setDeleteModal({ isOpen: false, id: null }); }} 
          title="Hapus Pengeluaran" 
          message="Yakin ingin menghapus data pengeluaran ini? Tindakan ini tidak dapat dibatalkan." 
          confirmText="Hapus" 
          confirmColor="red" 
        />
      )}
    </div>
  );
};

export default OwnerExpenses;
