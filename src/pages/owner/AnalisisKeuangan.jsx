import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useOwnerFinancials } from '../../hooks/owner/useOwnerFinancials';
import Sidebar from '../../components/owner/Sidebar';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { DownloadButton } from '../../components/owner/ui/DownloadButton';
import { ChartCard } from '../../components/owner/ui/ChartCard';

const AnalisisKeuangan = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    totalOmzetAktual, totalKasHariIni,
    omzetBulananData, omzetTahunanData, riwayatUangMasuk
  } = useOwnerFinancials();

  return (
    <div className="flex h-screen bg-[#f3f6f9] font-sans antialiased text-slate-700 overflow-hidden relative">
      <Sidebar 
        profileName={user?.name || user?.username}
        profileAvatar={user?.avatarUrl || user?.avatar}
        onProfileClick={() => navigate('/owner/profil')}
      />

      <main className="flex-1 p-6 overflow-y-auto h-full flex justify-center">
        <div className="w-full max-w-[1400px] space-y-5">
          <header className="flex justify-between items-center">
            <div className="space-y-0.5">
              <h1 className="text-xl font-bold text-[#0f1d37] tracking-tight">Analisis Pendapatan</h1>
              <p className="text-xs text-slate-400 font-medium">Pantau arus kas masuk dan tren omzet UD. BAROKAH</p>
            </div>
          </header>

          <div className="w-full space-y-4">
            
            {/* BARIS 1: KARTU METRIK UTAMA */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(11,22,44,0.02)] flex flex-col justify-center">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Pendapatan (Bulan Ini)</h4>
                <div className="text-[26px] font-black text-[#0f1d37] mt-1 tracking-tighter">
                  Rp {totalOmzetAktual.toLocaleString('id-ID')}
                </div>
                <span className="text-[10px] text-emerald-500 font-bold mt-1 flex items-center gap-1">
                  <ArrowUpRight size={12} /> Naik 12% dari bulan lalu
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(11,22,44,0.02)] flex flex-col justify-center">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Uang Masuk (Hari Ini)</h4>
                <div className="text-[26px] font-black text-[#10b981] mt-1 tracking-tighter">
                  Rp {totalKasHariIni.toLocaleString('id-ID')}
                </div>
                <span className="text-[10px] text-slate-400 font-medium mt-1">
                  Total dari pesanan selesai hari ini
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(11,22,44,0.02)] flex flex-col justify-between">
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Ekspor Laporan Pendapatan</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed mb-3">Unduh rekapan transaksi sukses untuk kebutuhan pembukuan toko.</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <DownloadButton label="Bulan Ini (.xlsx)" />
                  <DownloadButton label="Tahun Ini (.xlsx)" />
                </div>
              </div>
            </div>

            {/* BARIS 2: GRAFIK TREND PENDAPATAN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ChartCard title="Trend Omzet (Bulanan)" trend="+12%" color="#1e2e4d" data={omzetBulananData} />
              <ChartCard title="Trend Omzet (Tahunan)" trend="+25%" color="#10b981" data={omzetTahunanData} />
            </div>

            {/* BARIS 3: TABEL UANG MASUK SAJA */}
            <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(11,22,44,0.03)] border border-slate-100 overflow-hidden">
              <div className="p-5 border-b border-slate-50 bg-white">
                <h3 className="text-sm font-bold text-[#0f1d37] tracking-tight">Riwayat Uang Masuk Terbaru</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 bg-[#fbfcfd] text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                      <th className="py-4 px-5">ID Pesanan</th>
                      <th className="py-4 px-5">Pelanggan</th>
                      <th className="py-4 px-5">Metode Pembayaran</th>
                      <th className="py-4 px-5 text-right">Nominal Masuk</th>
                      <th className="py-4 px-5 text-center">Waktu</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-slate-600 font-medium">
                    {riwayatUangMasuk.map((log, i) => (
                      <tr key={i} className="hover:bg-[#f8fafc]/60 transition-colors">
                        <td className="py-3.5 px-5 font-bold text-indigo-600">{log.id}</td>
                        <td className="py-3.5 px-5 font-semibold text-slate-800">{log.pelanggan}</td>
                        <td className="py-3.5 px-5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold text-[9px] tracking-wide uppercase bg-slate-100 text-slate-600">
                            {log.metode}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-right font-bold text-[#10b981]">
                          + Rp {log.nominal.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3.5 px-5 text-center text-slate-400 font-normal flex items-center justify-center gap-1.5">
                           {log.waktu} <CheckCircle2 size={12} className="text-emerald-500"/>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalisisKeuangan;