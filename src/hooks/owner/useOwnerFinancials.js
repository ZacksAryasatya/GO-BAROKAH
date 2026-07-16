import { useState, useMemo } from 'react';

const MOCK_OMZET_BULANAN = [
  { name: 'Jan', omzet: 40000000 },
  { name: 'Feb', omzet: 45000000 },
  { name: 'Mar', omzet: 140000000 },
];

const MOCK_OMZET_TAHUNAN = [
  { name: '2024', omzet: 150000000 },
  { name: '2025', omzet: 200000000 },
  { name: '2026', omzet: 350000000 },
];

const MOCK_UANG_MASUK = [
  { id: "ORD-9901", metode: "Transfer Bank", pelanggan: "Toko Sinar Jaya", nominal: 14500000, waktu: "Hari ini, 10:24" },
  { id: "ORD-9902", metode: "COD", pelanggan: "Bapak Budi", nominal: 820000, waktu: "Hari ini, 08:15" },
  { id: "ORD-9903", metode: "E-Wallet", pelanggan: "Warung Berkah", nominal: 1200000, waktu: "Kemarin, 14:20" },
];

export const useOwnerFinancials = () => {
  const [omzetBulananData] = useState(MOCK_OMZET_BULANAN);
  const [omzetTahunanData] = useState(MOCK_OMZET_TAHUNAN);
  const [riwayatUangMasuk] = useState(MOCK_UANG_MASUK);

  const totalOmzetAktual = useMemo(() => {
    return omzetBulananData.reduce((sum, item) => sum + item.omzet, 0);
  }, [omzetBulananData]);

  const totalKasHariIni = useMemo(() => {
    return riwayatUangMasuk
      .filter(item => item.waktu.includes("Hari ini"))
      .reduce((sum, item) => sum + item.nominal, 0);
  }, [riwayatUangMasuk]);

  return {
    totalOmzetAktual,
    totalKasHariIni,
    omzetBulananData,
    omzetTahunanData,
    riwayatUangMasuk,
  };
};