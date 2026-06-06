import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProductAnalysis } from '../../hooks/owner/useProductAnalysis';
import Sidebar from '../../components/owner/Sidebar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Package, AlertTriangle, DollarSign, TrendingUp, Search, ArrowLeft, ArrowRight, Download } from 'lucide-react';
import { MetricCard } from '../../components/owner/ui/MetricCard';

const AnalisisProduk = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const {
    searchTerm, selectedKategori, currentPage, totalPages, itemsPerPage = 5,
    ringkasanAnalisis, grafikBatangData, grafikPieData, paginatedData, listKategori,
    setCurrentPage, handleSearchChange, handleKategoriChange
  } = useProductAnalysis();

  return (
    <div className="flex h-screen bg-slate-100 font-sans antialiased text-slate-800 overflow-hidden relative">
      <Sidebar 
        profileName={user?.name || user?.username}
        profileAvatar={user?.avatarUrl || user?.avatar}
        onProfileClick={() => navigate('/owner/profil')}
      />

      <main className="flex-1 p-5 overflow-y-auto h-full flex justify-center transition-all duration-300">
        <div className="w-full max-w-[1400px] space-y-4">
          <header className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Analisis & Rekap Barang</h1>
              <p className="text-xs text-slate-500">Pantau valuasi aset gudang dan performa produk berputar</p>
            </div>
            <button className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 font-bold text-xs px-3 py-2 rounded-lg hover:bg-slate-50 shadow-xs transition-all cursor-pointer">
              <Download className="h-3.5 w-3.5 text-slate-500" /> Ekspor (.xlsx)
            </button>
          </header>

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard icon={<Package className="h-4 w-4" />} label="Ragam Produk" value={`${ringkasanAnalisis.totalProduk} Jenis`} />
            <MetricCard icon={<Package className="h-4 w-4 text-blue-600"/>} label="Kuantitas Total Stok" value={`${ringkasanAnalisis.totalStok} Unit`} bg="bg-blue-50" />
            <MetricCard icon={<DollarSign className="h-4 w-4" />} label="Valuasi Nilai Produk" value={`Rp ${ringkasanAnalisis.totalNilaiAset.toLocaleString('id-ID')}`} bg="bg-emerald-50" textStyle="text-emerald-700" />
            
            <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs flex items-center gap-3">
              <div className={`p-2.5 rounded-lg shrink-0 ${ringkasanAnalisis.produkMenipis > 0 ? 'bg-amber-50 text-amber-600 animate-pulse' : 'bg-slate-100'}`}>
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Stok Masalah</span>
                <span className="text-xl font-black text-slate-900">
                  {ringkasanAnalisis.produkMenipis} <span className="text-xs font-medium text-amber-600">Menipis</span>
                  <span className="text-slate-300 mx-1.5">|</span>
                  <span className="text-rose-600">{ringkasanAnalisis.produkHabis}</span> <span className="text-xs font-medium text-rose-500">Habis</span>
                </span>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs h-64 flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-bold text-slate-900">Top 5 Produk Terlaris</h3>
                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded flex items-center gap-0.5"><TrendingUp className="h-2.5 w-2.5"/> Perputaran Tinggi</span>
              </div>
              <div className="flex-1 min-h-0 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={grafikBatangData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} tickFormatter={(value) => value.length > 12 ? `${value.substring(0, 10)}...` : value} />
                    <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                    <Tooltip className="text-xs font-sans" />
                    <Bar dataKey="Total Terjual" fill="#265345" radius={[4, 4, 0, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs h-64 flex flex-col">
              <h3 className="text-xs font-bold text-slate-900 mb-1">Porsi Kategori Gudang</h3>
              <div className="flex-1 min-h-0 w-full flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={grafikPieData} cx="35%" cy="50%" innerRadius={42} outerRadius={58} paddingAngle={3} dataKey="value">
                      {grafikPieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} Unit`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-1 text-[8px] font-bold text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 max-w-[120px] max-h-[90%] overflow-y-auto">
                  {grafikPieData.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}/>
                      <span className="truncate">{item.name} ({item.value} U)</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl border border-slate-200/60 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-3 justify-between items-center">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input 
                  type="text" placeholder="Cari produk atau supplier..." value={searchTerm} onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-slate-400"
                />
              </div>

              <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto py-1">
                {listKategori.map((kat) => (
                  <button key={kat} onClick={() => handleKategoriChange(kat)}
                    className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all cursor-pointer shrink-0 ${selectedKategori === kat ? 'bg-[#265345] text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    {kat}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto text-[11px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="p-3 pl-4 w-12 text-center">No</th>
                    <th className="p-3">Nama Produk</th>
                    <th className="p-3">Supplier</th>
                    <th className="p-3">Kategori</th>
                    <th className="p-3 text-center">Stok Gudang</th>
                    <th className="p-3 text-right">Harga Satuan</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {paginatedData.length > 0 ? (
                    paginatedData.map((produk, idx) => (
                      <tr key={produk.id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="p-3 pl-4 text-center font-medium text-slate-400">
                          {(currentPage - 1) * itemsPerPage + idx + 1}
                        </td>
                        <td className="p-3 font-bold text-slate-800">
                          {produk.nama}
                          <span className="block text-[9px] font-normal text-slate-400 mt-0.5">Total Terjual: {produk.terjual} unit</span>
                        </td>
                        <td className="p-3 font-medium">{produk.supplier}</td>
                        <td className="p-3"><span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[9px] font-semibold">{produk.kategori}</span></td>
                        <td className="p-3 text-center font-bold text-slate-900">{produk.stok} dus</td>
                        <td className="p-3 text-right font-bold text-slate-900">Rp {produk.harga.toLocaleString('id-ID')}</td>
                        <td className="p-3 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded font-bold text-[9px] ${
                            produk.status === "Tersedia" ? "bg-emerald-50 text-emerald-700" :
                            produk.status === "Menipis" ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700"
                          }`}>{produk.status}</span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="7" className="p-8 text-center text-slate-400 font-medium bg-white">Tidak ada data produk.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="p-3 border-t border-slate-100 flex items-center justify-between bg-white text-xs">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} className="flex items-center gap-1 px-2.5 py-1 rounded border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50 font-semibold cursor-pointer">
                  <ArrowLeft className="h-3 w-3" /> Previous
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`w-6 h-6 rounded flex items-center justify-center font-bold text-[11px] cursor-pointer ${currentPage === i + 1 ? 'bg-[#265345] text-white shadow-xs' : 'text-slate-500 hover:bg-slate-100'}`}>
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} className="flex items-center gap-1 px-2.5 py-1 rounded border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50 font-semibold cursor-pointer">
                  Next <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            )}
          </section>

        </div>
      </main>
    </div>
  );
};

export default AnalisisProduk;