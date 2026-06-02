import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useOwnerFinancials } from '../../hooks/owner/useOwnerFinancials';
import Sidebar from '../../components/owner/Sidebar';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
import { Download, CheckCircle, TrendingUp, ArrowUpRight, ArrowDownRight, Settings2, X } from 'lucide-react';

// ==========================================
// 1. DATA STATIS GLOBAL (Memory Optimization)
// ==========================================
const MOCK_TRANSACTIONS = [
  { id: "TX-9901", tipe: "Pemasukan", desc: "Penjualan Beras Mawar Grosir", nominal: 14500000, waktu: "Hari ini, 10:24" },
  { id: "TX-9902", tipe: "Pengeluaran", desc: "Restock Bahan Baku Terigu", nominal: 8200000, waktu: "Hari ini, 08:15" },
  { id: "TX-9903", tipe: "Pengeluaran", desc: "Biaya Operasional Listrik & Air", nominal: 1200000, waktu: "26 Mei 2026" },
];

const AnalisisKeuangan = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const {
    targetInput,
    setTargetInput,
    currentProgress,
    totalLabaAktual,
    isLoading,
    labaBulananData,
    labaTahunanData,
    biayaPieData,
    handleUpdateTarget
  } = useOwnerFinancials();

  // ==========================================
  // 2. KALKULASI ARUS KAS (Memoized)
  // ==========================================
  const totalArusKasAktual = useMemo(() => {
    return MOCK_TRANSACTIONS.reduce((sum, item) => {
      return item.tipe === "Pemasukan" ? sum + item.nominal : sum - item.nominal;
    }, 0);
  }, []);

  const handleFormSubmit = (e) => {
    handleUpdateTarget(e);
    setIsPanelOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#f3f6f9] font-sans antialiased text-slate-700 overflow-hidden relative">
      
      <Sidebar 
        profileName={user?.name || user?.username}
        profileAvatar={user?.avatarUrl || user?.avatar}
        onProfileClick={() => navigate('/owner/profil')}
      />

      <main className="flex-1 p-6 overflow-y-auto h-full flex justify-center">
        <div className="w-full max-w-[1400px] space-y-5">
          
          {/* HEADER PAGE */}
          <header className="flex justify-between items-center">
            <div className="space-y-0.5">
              <h1 className="text-xl font-bold text-[#0f1d37] tracking-tight">Analisis Keuangan</h1>
              <p className="text-xs text-slate-400 font-medium">Lihat perkembangan keuangan perusahaan UD. BAROKAH</p>
            </div>
            
            <button
              onClick={() => setIsPanelOpen(true)}
              className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl hover:bg-slate-50 shadow-[0_2px_6px_rgba(11,22,44,0.02)] transition-all active:scale-95 cursor-pointer"
            >
              <Settings2 className="h-3.5 w-3.5 text-slate-400" />
              Atur Target Keuangan
            </button>
          </header>

          <div className="w-full space-y-4">
            
            {/* BARIS 1: KARTU METRIK */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* PROGRESS TARGET */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(11,22,44,0.02)] flex flex-col justify-between">
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target Vs Aktual</h4>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-[22px] font-black text-[#0f1d37]">{currentProgress}%</span>
                    <span className={`text-[10px] font-bold ${currentProgress >= 100 ? 'text-[#10b981]' : 'text-blue-500'}`}>
                      {currentProgress >= 100 ? 'Target Achieved' : 'On Track'}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div 
                    className="bg-[#1e2e4d] h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(currentProgress, 100)}%` }} 
                  />
                </div>
              </div>

              {/* ARUS KAS */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(11,22,44,0.02)] flex flex-col justify-between">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Arus Kas Operasi</h4>
                <div className="text-[22px] font-black text-[#0f1d37] mt-1">
                  Rp {totalArusKasAktual.toLocaleString('id-ID')}
                </div>
                <span className="text-[10px] text-slate-400 font-medium mt-1">Sisa uang tunai berputar saat ini</span>
              </div>

              {/* DOWNLOAD LAPORAN */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(11,22,44,0.02)]">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Unduh Dokumen</h4>
                <div className="grid grid-cols-2 gap-2">
                  <DownloadButton label="Neraca (2023)" />
                  <DownloadButton label="Laba Rugi (Q4)" />
                </div>
              </div>
            </div>

            {/* BARIS 2: DIAGRAM / VISUALISASI */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <ChartCard title="Laba Bersih (Bulanan)" trend="+7%" color="#1e2e4d" data={labaBulananData} />
              
              <ChartCard title="Laba Bersih (Tahunan)" trend="+20%" color="#3b82f6" data={labaTahunanData} />

              {/* DONUT CHART BIAYA */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(11,22,44,0.02)] h-60 flex flex-col">
                <h3 className="text-xs font-bold text-[#0f1d37] mb-2 uppercase tracking-wide">Analisis Biaya</h3>
                <div className="flex-1 min-h-0 w-full flex items-center justify-center relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={biayaPieData} cx="30%" cy="50%" innerRadius={42} outerRadius={58} paddingAngle={3} dataKey="value">
                        {biayaPieData?.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  {/* LEGENDA DOKUMEN */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 text-[9px] font-bold text-slate-400 bg-[#f8fafc] p-3 rounded-xl border border-slate-100 max-w-[120px]">
                    {biayaPieData?.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 truncate">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }}/>
                        <span className="text-slate-600 font-semibold">{item.value}% {item.name.split(' ')[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* BARIS 3: LOG TABEL */}
            <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(11,22,44,0.03)] border border-slate-100 overflow-hidden">
              <div className="p-5 border-b border-slate-50 bg-white">
                <h3 className="text-sm font-bold text-[#0f1d37] tracking-tight">Arus Kas & Log Transaksi Terbaru</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 bg-[#fbfcfd] text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                      <th className="py-4 px-5">ID Transaksi</th>
                      <th className="py-4 px-5">Tipe</th>
                      <th className="py-4 px-5">Deskripsi Aktivitas</th>
                      <th className="py-4 px-5 text-right">Nominal Anggaran</th>
                      <th className="py-4 px-5 text-center">Waktu Pembaruan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-slate-600 font-medium">
                    {MOCK_TRANSACTIONS.map((log, i) => (
                      <tr key={i} className="hover:bg-[#f8fafc]/60 transition-colors">
                        <td className="py-3.5 px-5 font-bold text-indigo-600">{log.id}</td>
                        <td className="py-3.5 px-5">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold text-[9px] tracking-wide uppercase ${
                            log.tipe === "Pemasukan" ? "bg-[#eefbf4] text-[#10b981]" : "bg-[#fff5f5] text-[#fa5252]"
                          }`}>
                            {log.tipe === "Pemasukan" ? <ArrowUpRight className="h-3 w-3"/> : <ArrowDownRight className="h-3 w-3"/>}
                            {log.tipe}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 font-semibold text-slate-800">{log.desc}</td>
                        <td className="py-3.5 px-5 text-right font-bold text-[#0f1d37]">Rp {log.nominal.toLocaleString('id-ID')}</td>
                        <td className="py-3.5 px-5 text-center text-slate-400 font-normal">{log.waktu}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* OVERLAY & DRAWER SIDE PANEL */}
      {isPanelOpen && (
        <div className="fixed inset-0 bg-[#0f1d37]/10 backdrop-blur-xs z-40 transition-opacity" onClick={() => setIsPanelOpen(false)} />
      )}

      {/* FIXED FORM SUBMIT BUG (DRAWER) */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl border-l border-slate-100 z-50 p-6 transform transition-transform duration-300 ease-in-out flex flex-col justify-between ${
        isPanelOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        {/* Pembungkus Form Tunggal */}
        <form onSubmit={handleFormSubmit} className="h-full flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Control Panel</span>
                <h3 className="text-sm font-bold text-[#0f1d37]">Atur Target Finansial</h3>
              </div>
              <button type="button" onClick={() => setIsPanelOpen(false)} className="p-1.5 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nominal Target Baru</label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs font-bold text-slate-400">Rp</span>
                <input 
                  type="number"
                  value={targetInput}
                  onChange={(e) => setTargetInput(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2.5 text-xs font-bold text-[#0f1d37] focus:border-slate-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="bg-[#f8fafc] p-4 rounded-xl border border-slate-100 space-y-2.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Kalkulasi Otomatis</span>
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>Total Laba Berjalan:</span>
                <span className="font-bold text-[#0f1d37]">Rp {totalLabaAktual.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>Prediksi Progres:</span>
                <span className="font-black text-blue-600">{currentProgress}%</span>
              </div>
            </div>
          </div>

          {/* BUTTON DIUBAH MENJADI TYPE SUBMIT TANPA DOUBLE ONCLICK EVENT */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-1.5 bg-[#1e2e4d] hover:bg-[#0f1d37] text-white py-3 rounded-xl text-xs font-bold shadow-[0_2px_6px_rgba(30,46,77,0.15)] disabled:opacity-50 transition-all cursor-pointer"
          >
            <CheckCircle className="h-3.5 w-3.5" />
            {isLoading ? 'Menyimpan...' : 'Terapkan Ekspektasi Target'}
          </button>
        </form>
      </div>

    </div>
  );
};

// ==========================================
// 3. SUB-COMPONENTS (Clean & Reusable Architecture)
// ==========================================
const DownloadButton = ({ label }) => (
  <button className="flex items-center justify-between p-2.5 rounded-xl bg-[#f8fafc] border border-slate-100 text-[10px] font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer">
    <span className="truncate">{label}</span>
    <Download className="h-3 w-3 text-slate-400 shrink-0 ml-1" />
  </button>
);

const ChartCard = ({ title, trend, color, data }) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(11,22,44,0.02)] h-60 flex flex-col">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-xs font-bold text-[#0f1d37] uppercase tracking-wide">{title}</h3>
      <span className="text-[10px] font-bold text-[#10b981] bg-[#eefbf4] px-1.5 py-0.5 rounded-md">
        <TrendingUp className="h-3 w-3 inline mr-0.5 -mt-0.5"/> {trend}
      </span>
    </div>
    <div className="flex-1 min-h-0 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -28, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc"/>
          <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} fontClassName="font-medium" />
          <YAxis stroke="#94a3b8" fontSize={9} tickFormatter={(v) => `${v/1000000}Jt`} />
          <Tooltip formatter={(value) => [`Rp ${value.toLocaleString()}`, 'Laba']} />
          <Area type="monotone" dataKey="laba" stroke={color} fill={color} fillOpacity={0.03} strokeWidth={1.5} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default AnalisisKeuangan;