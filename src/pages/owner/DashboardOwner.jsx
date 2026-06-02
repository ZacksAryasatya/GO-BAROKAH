import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/owner/Sidebar'; 
import { useOwnerDashboard } from '../../hooks/owner/useOwnerDashboard';
import { 
  TrendingUp, BarChart3, LineChart, 
  ShoppingBag, DollarSign, Percent, Users, AlertCircle, Calendar 
} from 'lucide-react';


const STATIC_ORDERS = [
  { id: "ORD-001", customer: "Adika imut", idCust: "CUST-001", date: "24/02/2026 14:30", items: 5, total: 1000000, status: "Menunggu" },
  { id: "ORD-002", customer: "Adika imut", idCust: "CUST-001", date: "24/02/2026 14:30", items: 5, total: 1000000, status: "Sedang Disiapkan" }
];

const STATIC_PRODUCTS = [
  { no: 1, name: "Beras Mawar 24Kg" },
  { no: 2, name: "Aqua 1L" },
  { no: 3, name: "Gula merah kardus" },
  { no: 4, name: "Indomie Goreng" }
];

const DashboardOwner = () => {
  const navigate = useNavigate();
  const { profile, stats, loading, message } = useOwnerDashboard();

  
  if (loading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#f3f6f9]">
        <div className="h-9 w-9 animate-spin rounded-full border-3 border-[#1e2e4d] border-t-transparent"></div>
        <p className="mt-4 text-xs font-semibold text-slate-500 tracking-wide animate-pulse">Memuat data UD. BAROKAH...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f3f6f9] font-sans antialiased text-slate-700 overflow-hidden">
      
      <Sidebar 
        profileName={profile?.name || profile?.username}
        profileAvatar={profile?.avatarUrl || profile?.avatar}
        onProfileClick={() => navigate('/owner/profil')}
      />

      <main className="flex-1 p-8 overflow-y-auto h-full flex justify-center">
        <div className="w-full max-w-[1300px] space-y-6">
          
          {/* HEADER DASHBOARD */}
          <header className="space-y-1">
            <h1 className="text-[22px] font-bold text-[#0f1d37] tracking-tight">Dashboard</h1>
            <p className="text-xs text-slate-400 font-medium">Selamat datang di UD BAROKAH Admin Dashboard</p>
          </header>

          {/* ALERT NOTIFIKASI SYSTEM */}
          {message?.text && (
            <div className={`p-4 rounded-xl text-xs font-bold border flex items-center gap-2 tracking-wide ${
              message.type === 'success' 
                ? 'bg-[#eefbf4] text-[#10b981] border-[#emerald-100]' 
                : 'bg-[#fff5f5] text-[#fa5252] border-rose-100'
            }`}>
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{message.text}</span>
            </div>
          )}

          {/* SECTION I: KARTU GRAFIK (Wadah Minimalis) */}
          <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <ChartWrapper title="Penjualan Per Hari" icon={<BarChart3 className="h-4 w-4 text-slate-400" />}>
              <div className="text-[11px] text-slate-400 font-mono tracking-wider">[ Area Chart Render ]</div>
            </ChartWrapper>
            
            <ChartWrapper title="Penjualan Per Bulan" icon={<LineChart className="h-4 w-4 text-slate-400" />}>
              <div className="text-[11px] text-slate-400 font-mono tracking-wider">[ Line Chart Render ]</div>
            </ChartWrapper>
            
            <ChartWrapper title="Penjualan Pertahun" icon={<TrendingUp className="h-4 w-4 text-slate-400" />}>
              <div className="text-[11px] text-slate-400 font-mono tracking-wider">[ Trend Analysis Render ]</div>
            </ChartWrapper>
          </section>

          {/* SECTION II: KARTU STATISTIK RINGKASAN */}
          <section className="grid grid-cols-2 gap-4 md:grid-cols-5">
            <StatCard title="Total Pesanan" value={stats.totalOrders || 0} icon={<ShoppingBag />} suffix=" Transaksi" />
            <StatCard title="Omzet" value={`Rp ${(stats.revenue || 0).toLocaleString('id-ID')}`} icon={<DollarSign />} isCurrency />
            <StatCard title="Rata-rata Pesanan" value="Rp 0" icon={<Percent />} isCurrency />
            <StatCard title="Pengguna" value={stats.users || 0} icon={<Users />} suffix=" User" />
            <StatCard title="Perlu Dikirim" value="0" icon={<AlertCircle />} isHighlight />
          </section>

          {/* SECTION III: TABEL UTAMA */}
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-start">
            
            {/* TABEL TRANSAKSI TERAKHIR */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-[0_2px_12px_rgba(11,22,44,0.03)] border border-slate-100 overflow-hidden">
              <div className="p-5 border-b border-slate-50 bg-white">
                <h3 className="text-sm font-bold text-[#0f1d37] tracking-tight">Transaksi Terakhir</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-slate-100 bg-[#fbfcfd] text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                      <th className="py-4 px-5">ID Pesanan</th>
                      <th className="py-4 px-5">Pelanggan</th>
                      <th className="py-4 px-5">Tanggal</th>
                      <th className="py-4 px-5 text-center">Total Item</th>
                      <th className="py-4 px-5 text-right">Total Harga</th>
                      <th className="py-4 px-5 text-center">Status Paket</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-xs text-slate-600 font-medium">
                    {STATIC_ORDERS.map((order, idx) => (
                      <tr key={idx} className="hover:bg-[#f8fafc]/60 transition-colors">
                        <td className="py-4 px-5 font-semibold text-blue-600 hover:underline cursor-pointer">{order.id}</td>
                        <td className="py-4 px-5">
                          <div className="font-bold text-slate-800">{order.customer}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">{order.idCust}</div>
                        </td>
                        <td className="py-4 px-5 text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-slate-300" />
                            <span>{order.date}</span>
                          </div>
                        </td>
                        <td className="py-4 px-5 text-center">
                          <span className="bg-slate-100 px-2.5 py-0.5 rounded text-[11px] font-bold text-slate-500">
                            {order.items} Item
                          </span>
                        </td>
                        <td className="py-4 px-5 text-right font-bold text-[#0f1d37]">
                          Rp {order.total.toLocaleString('id-ID')}
                        </td>
                        <td className="py-4 px-5 text-center">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide ${
                            order.status === "Menunggu" 
                              ? "bg-[#fff9db] text-[#f59f00]" 
                              : "bg-[#eefbf4] text-[#10b981]"
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* TABEL PRODUK TERLARIS */}
            <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(11,22,44,0.03)] border border-slate-100 overflow-hidden">
              <div className="p-5 border-b border-slate-50 bg-white">
                <h3 className="text-sm font-bold text-[#0f1d37] tracking-tight">Produk Terlaris</h3>
              </div>
              <div className="p-4 space-y-2">
                <div className="grid grid-cols-12 bg-[#fbfcfd] border border-slate-100 p-2.5 rounded-xl text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <span className="col-span-3 text-center">Rank</span>
                  <span className="col-span-9 pl-2">Nama Produk</span>
                </div>
                <div className="divide-y divide-slate-50">
                  {STATIC_PRODUCTS.map((prod) => (
                    <div key={prod.no} className="grid grid-cols-12 items-center py-3">
                      <div className="col-span-3 flex justify-center">
                        <span className={`flex h-6 w-6 items-center justify-center rounded-lg text-[11px] font-bold ${
                          prod.no === 1 
                            ? "bg-[#fff9db] text-[#f59f00]" 
                            : "bg-slate-100 text-slate-500"
                        }`}>
                          #{prod.no}
                        </span>
                      </div>
                      <span className="col-span-9 pl-2 font-bold text-slate-800 text-xs">{prod.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </section>
        </div>
      </main>
    </div>
  );
};

const ChartWrapper = ({ title, icon, children }) => (
  <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_2px_8px_rgba(11,22,44,0.02)]">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</h3>
      {icon}
    </div>
    <div className="h-36 rounded-xl bg-[#f8fafc] border border-dashed border-slate-200 flex items-center justify-center">
      {children}
    </div>
  </div>
);

const StatCard = ({ title, value, icon, suffix = "", isCurrency, isHighlight }) => {
  const valueColor = isHighlight ? "text-[#fa5252]" : "text-[#0f1d37]";
  
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_2px_8px_rgba(11,22,44,0.02)] flex flex-col justify-between space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{title}</span>
        <div className="p-1.5 rounded-lg bg-[#f3f6f9] text-slate-400 [&>svg]:h-3.5 [&>svg]:w-3.5">
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-0.5">
        <span className={`font-bold tracking-tight ${valueColor} ${isCurrency ? 'text-base' : 'text-[22px]'}`}>
          {value}
        </span>
        {!isCurrency && suffix && (
          <span className="text-[11px] text-slate-400 font-bold ml-0.5">{suffix}</span>
        )}
      </div>
    </div>
  );
};

export default DashboardOwner;