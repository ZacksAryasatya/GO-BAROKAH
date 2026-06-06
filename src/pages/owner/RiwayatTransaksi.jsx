import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTransactionHistory } from '../../hooks/owner/useTransactionHistory';
import Sidebar from '../../components/owner/Sidebar';
import { Search, ChevronDown, Calendar, CreditCard, Wallet, Banknote } from 'lucide-react';
import { SummaryCard } from '../../components/owner/ui/SummaryCard';

const RiwayatTransaksi = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    searchTerm, statusFilter, paymentFilter, currentPage, totalPages,
    ringkasanTransaksi, paginatedData, totalRecords,
    setCurrentPage, handleSearch, handleStatusFilter, handlePaymentFilter
  } = useTransactionHistory();

  const getPaymentIcon = (method) => {
    switch (method) {
      case 'Transfer Bank': return <Banknote className="h-4 w-4 text-slate-400 shrink-0" />;
      case 'E-Wallet': return <Wallet className="h-4 w-4 text-slate-400 shrink-0" />;
      default: return <CreditCard className="h-4 w-4 text-slate-400 shrink-0" />;
    }
  };

  return (
    <div className="flex h-screen bg-[#f3f6f9] font-sans antialiased text-slate-700 overflow-hidden">
      <Sidebar 
        profileName={user?.name || user?.username}
        profileAvatar={user?.avatarUrl || user?.avatar}
        onProfileClick={() => navigate('/owner/profil')}
      />

      <main className="flex-1 p-8 overflow-y-auto h-full flex justify-center">
        <div className="w-full max-w-[1300px] space-y-6">
          <div className="space-y-1">
            <h1 className="text-[22px] font-bold text-[#0f1d37] tracking-tight">Riwayat Transaksi</h1>
            <p className="text-xs text-slate-400 font-medium">Lihat semua transaksi yang telah dilakukan</p>
          </div>

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard title="Total Transaksi" value={ringkasanTransaksi.totalNominal} subtitle={`${ringkasanTransaksi.totalItem.toLocaleString('id-ID')} Transaksi`} isCurrency />
            <SummaryCard title="Menunggu" value={ringkasanTransaksi.menungguCount} subtitle="Menunggu Konfirmasi" isWarning />
            <SummaryCard title="Berhasil" value={ringkasanTransaksi.suksesCount} subtitle="Transaksi Sukses" isSuccess />
            <SummaryCard title="Gagal" value={ringkasanTransaksi.gagalCount} subtitle="Transaksi Gagal" isDanger />
          </section>

          <section className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(11,22,44,0.03)] border border-slate-100 overflow-hidden">
            <div className="p-5 flex flex-col sm:flex-row gap-3 justify-between items-center bg-white border-b border-slate-50">
              <div className="relative w-full sm:w-80 group">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 group-focus-within:text-slate-500" />
                <input 
                  type="text" placeholder="Cari ID Transaksi, pesanan, atau pelanggan ..." value={searchTerm} onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#f8fafc] border border-transparent rounded-xl text-xs font-medium focus:outline-none focus:border-slate-200 focus:bg-white placeholder:text-slate-400 transition-all text-slate-700"
                />
              </div>

              <div className="flex gap-2.5 w-full sm:w-auto justify-end">
                <div className="relative">
                  <select value={statusFilter} onChange={(e) => handleStatusFilter(e.target.value)} className="appearance-none bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 pl-4 pr-10 py-2.5 focus:outline-none focus:border-slate-400 transition-colors cursor-pointer">
                    <option value="Semua Status">Semua Status</option>
                    <option value="Berhasil">Berhasil</option>
                    <option value="Menunggu">Menunggu</option>
                    <option value="Gagal">Gagal</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
                </div>
                <div className="relative">
                  <select value={paymentFilter} onChange={(e) => handlePaymentFilter(e.target.value)} className="appearance-none bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 pl-4 pr-10 py-2.5 focus:outline-none focus:border-slate-400 transition-colors cursor-pointer">
                    <option value="Semua Pembayaran">Semua Pembayaran</option>
                    <option value="Transfer Bank">Transfer Bank</option>
                    <option value="E-Wallet">E-Wallet</option>
                    <option value="COD">COD</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-slate-100 bg-[#fbfcfd] text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                    <th className="py-4 px-6">ID Transaksi</th>
                    <th className="py-4 px-6">ID Pesanan</th>
                    <th className="py-4 px-6">Pelanggan</th>
                    <th className="py-4 px-6">Tanggal & Waktu</th>
                    <th className="py-4 px-6">Metode Pembayaran</th>
                    <th className="py-4 px-6 text-right">Jumlah</th>
                    <th className="py-4 px-6 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs text-slate-600 font-medium">
                  {paginatedData.length > 0 ? (
                    paginatedData.map((tx) => (
                      <tr key={tx.id} className="hover:bg-[#f8fafc]/60 transition-colors">
                        <td className="py-4 px-6 font-semibold text-[#1e2e4d]">{tx.id}</td>
                        <td className="py-4 px-6 text-blue-600 hover:underline cursor-pointer font-medium">{tx.idPesanan}</td>
                        <td className="py-4 px-6 text-slate-800 font-semibold">{tx.pelanggan}</td>
                        <td className="py-4 px-6 text-slate-400">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5 text-slate-300" /> <span>{tx.tanggal}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2 text-slate-600">
                            {getPaymentIcon(tx.metode)} <span>{tx.metode}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right font-bold text-[#0f1d37] text-sm">Rp {tx.jumlah.toLocaleString('id-ID')}</td>
                        <td className="py-4 px-6 text-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-md text-[11px] font-bold tracking-wide ${tx.status === "Berhasil" ? "bg-[#eefbf4] text-[#10b981]" : tx.status === "Menunggu" ? "bg-[#fff9db] text-[#f59f00]" : "bg-[#fff5f5] text-[#fa5252]"}`}>
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="7" className="py-16 text-center text-slate-400 font-medium bg-white">Tidak ada riwayat transaksi yang sesuai filter.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-[#fbfcfd] border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Menampilkan {paginatedData.length} dari {totalRecords.toLocaleString('id-ID')} transaksi</span>
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-40 font-semibold hover:bg-slate-50 transition-all cursor-pointer">Previous</button>
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs transition-all cursor-pointer ${currentPage === i + 1 ? 'bg-[#1e2e4d] text-white' : 'text-slate-500 bg-white border border-slate-200 hover:bg-slate-50'}`}>
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-40 font-semibold hover:bg-slate-50 transition-all cursor-pointer">Next</button>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default RiwayatTransaksi;