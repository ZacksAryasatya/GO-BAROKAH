import React, { useState, useMemo, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Shield, ShieldAlert, Users, Search, Loader2 } from "lucide-react";
import OwnerSidebar from "../../components/owner/OwnerSidebar";
import ConfirmModal from "../../components/forms/ConfirmModal";
import { useOwnerEmployees } from "../../hooks/owner/useOwnerEmployees";

const PER_PAGE = 10;

const OwnerEmployees = () => {
  const { 
    users, admins, isLoading, actionLoading, 
    fetchEmployees, handlePromote, handleDemote 
  } = useOwnerEmployees();

  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("ALL"); 
  const [page, setPage] = useState(1);
  const [isScrolled, setIsScrolled] = useState(false);
  const tableScrollRef = useRef(null);
  
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: null, email: null, name: null });

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => { setPage(1); }, [search, filterRole]);

  useEffect(() => {
    const el = tableScrollRef.current;
    if (!el) return;
    const onScroll = () => setIsScrolled(el.scrollTop > 40);
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const allEmployees = useMemo(() => {
    return [...users, ...admins];
  }, [users, admins]);

  const filteredEmployees = useMemo(() => {
    let filtered = allEmployees;

    if (filterRole !== "ALL") {
      filtered = filtered.filter(e => e.role?.toUpperCase() === filterRole);
    }

    if (search) {
      filtered = filtered.filter(e => 
        e.name?.toLowerCase().includes(search.toLowerCase()) ||
        e.email?.toLowerCase().includes(search.toLowerCase())
      );
    }

    return filtered;
  }, [allEmployees, search, filterRole]);

  const totalPages = Math.ceil(filteredEmployees.length / PER_PAGE) || 1;
  const paginated = filteredEmployees.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const LoadingSkeleton = () => (
    <div className="flex h-screen bg-[#F8FAFC]">
      <OwnerSidebar />
      <main className="flex-1 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">
          Memuat data pegawai...
        </p>
      </main>
    </div>
  );

  const onConfirmAction = async () => {
    const { type, email } = confirmModal;
    setConfirmModal({ isOpen: false, type: null, email: null, name: null });
    
    if (type === "PROMOTE") {
      await handlePromote(email);
    } else if (type === "DEMOTE") {
      await handleDemote(email);
    }
  };

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden text-[13px]">
      <OwnerSidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-5 flex items-center justify-between z-10 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-black tracking-tighter text-slate-800 uppercase leading-none">Pegawai</h2>
            <p className="text-[10px] text-slate-400 font-black mt-1.5 uppercase tracking-[0.2em]">Manajemen Akun User & Admin</p>
          </div>
        </header>

        <div className="p-8 flex-1 flex flex-col overflow-hidden">
          {/* Filter Bar */}
          <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm mb-6 flex items-center gap-2 transition-all focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500/20">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Cari berdasarkan nama atau email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-transparent border-transparent focus:border-transparent focus:ring-0 outline-none text-xs font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-medium shadow-none"
              />
            </div>
            <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
            <div className="flex gap-1 pr-2">
              {['ALL', 'ADMIN', 'USER'].map(role => (
                <button
                  key={role}
                  onClick={() => setFilterRole(role)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all ${
                    filterRole === role 
                      ? 'bg-emerald-50 text-emerald-600 shadow-sm border border-emerald-200' 
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden relative">
            <div className={`absolute top-0 left-0 right-0 h-14 bg-white/80 backdrop-blur-md z-10 border-b transition-colors duration-300 ${isScrolled ? "border-slate-200" : "border-transparent"}`}>
              <div className="flex h-full items-center px-6">
                <div className="w-[30%] text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama</div>
                <div className="w-[30%] text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</div>
                <div className="w-[20%] text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Role</div>
                <div className="w-[20%] text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</div>
              </div>
            </div>

            <div ref={tableScrollRef} className="flex-1 overflow-y-auto custom-scrollbar pt-14">
              {paginated.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {paginated.map((emp, idx) => (
                    <div key={emp.email || idx} className="flex items-center px-6 py-4 hover:bg-slate-50/80 transition-colors group">
                      <div className="w-[30%]">
                        <p className="text-xs font-bold text-slate-800 line-clamp-1">{emp.name}</p>
                      </div>
                      
                      <div className="w-[30%]">
                        <p className="text-xs text-slate-500 font-medium truncate pr-4">{emp.email}</p>
                      </div>

                      <div className="w-[20%] flex justify-center">
                        {emp.role === "admin" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 uppercase tracking-wider">
                            <Shield size={10} /> Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black text-slate-600 bg-slate-100 border border-slate-200 uppercase tracking-wider">
                            <Users size={10} /> User
                          </span>
                        )}
                      </div>

                      <div className="w-[20%] flex justify-end">
                        {emp.role === "admin" ? (
                          <button 
                            onClick={() => setConfirmModal({ isOpen: true, type: "DEMOTE", email: emp.email, name: emp.name })}
                            disabled={actionLoading}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-[10px] font-black text-red-600 hover:bg-red-50 transition-all uppercase tracking-widest disabled:opacity-50"
                          >
                            <ShieldAlert size={12} /> Demote
                          </button>
                        ) : (
                          <button 
                            onClick={() => setConfirmModal({ isOpen: true, type: "PROMOTE", email: emp.email, name: emp.name })}
                            disabled={actionLoading}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-200 text-[10px] font-black text-emerald-600 hover:bg-emerald-50 transition-all uppercase tracking-widest disabled:opacity-50"
                          >
                            <Shield size={12} /> Promote
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center">
                    <Users size={32} className="text-slate-300" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-600 mb-1">Tidak ada data pegawai</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider">Coba sesuaikan filter atau pencarian Anda</p>
                  </div>
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

      {confirmModal.isOpen && (
        <ConfirmModal 
          isOpen={confirmModal.isOpen} 
          onClose={() => setConfirmModal({ isOpen: false, type: null, email: null, name: null })} 
          onConfirm={onConfirmAction} 
          title={confirmModal.type === "PROMOTE" ? "Promote ke Admin" : "Demote ke User"} 
          message={`Apakah Anda yakin ingin menjadikan ${confirmModal.name} (${confirmModal.email}) sebagai ${confirmModal.type === "PROMOTE" ? "Admin" : "User"}?`} 
          confirmText={confirmModal.type === "PROMOTE" ? "Promote" : "Demote"} 
          confirmColor={confirmModal.type === "PROMOTE" ? "emerald" : "red"} 
        />
      )}
    </div>
  );
};

export default OwnerEmployees;
