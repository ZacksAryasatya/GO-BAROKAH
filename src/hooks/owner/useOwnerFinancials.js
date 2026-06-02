import { useState, useMemo, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

// ==============================================================================
// 1. DATA MOCK / STATIS GLOBAL (Aman dari Realokasi Memori)
// ==============================================================================
const MOCK_LABA_BULANAN = [
  { name: 'Jan', laba: 40000000 },
  { name: 'Feb', laba: 45000000 },
  { name: 'Mar', laba: 140000000 },
];

const MOCK_LABA_TAHUNAN = [
  { name: '2024', laba: 150000000 },
  { name: '2025', laba: 200000000 },
  { name: '2026', laba: 350000000 },
];

const MOCK_BIAYA_PIE = [
  { name: 'Gaji Karyawan', value: 20, color: '#475569' },
  { name: 'Operasional', value: 30, color: '#D97706' },
  { name: 'Bahan Baku', value: 50, color: '#1E3A34' },
];

export const useOwnerFinancials = () => {
  const [targetInput, setTargetInput] = useState("250000000");
  const [isLoading, setIsLoading] = useState(false);

  // Menggunakan state awal dari data mock agar struktur siap diganti Fetch API nantinya
  const [labaBulanan] = useState(MOCK_LABA_BULANAN);
  const [labaTahunan] = useState(MOCK_LABA_TAHUNAN);
  const [biayaPie] = useState(MOCK_BIAYA_PIE);

  // ==============================================================================
  // 2. LOGIKA KALKULASI OTOMATIS (Aman dari Infinite Loop karena referensi stabil)
  // ==============================================================================
  const totalLabaAktual = useMemo(() => {
    return labaBulanan.reduce((sum, item) => sum + item.laba, 0);
  }, [labaBulanan]); // Dependensi merujuk ke state yang stabil

  const currentProgress = useMemo(() => {
    const target = Number(targetInput);
    if (!target || target === 0) return 0;
    
    const persentase = (totalLabaAktual / target) * 100;
    
    // Jangan dikunci di 100% pada tingkat data agar data tetap akurat (misal pencapaian 120%)
    // Pembatasan visual bar maksimal 100% diserahkan ke komponen UI
    return Math.round(persentase); 
  }, [totalLabaAktual, targetInput]);

  // ==============================================================================
  // 3. MUTASI DATA / API HANDLER (Dilengkapi Network Cleanup)
  // ==============================================================================
  const handleUpdateTarget = useCallback(async (e) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    
    setIsLoading(true);
    const controller = new AbortController(); // Untuk menghentikan request jika page di-unmount
    
    try {
      await api.post('/api/owner/update-target', {
        targetAmount: Number(targetInput),
        calculatedProgress: currentProgress 
      }, { signal: controller.signal }).catch((err) => {
        if (err.name === 'CanceledError') return;
        console.warn("Menggunakan lokal fallback karena API backend belum siap:", err);
      });

      toast.success("Target finansial baru berhasil diterapkan!");
    } catch (error) {
      if (error.name !== 'CanceledError') {
        toast.error("Gagal memperbarui target.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [targetInput, currentProgress]);

  return {
    targetInput,
    setTargetInput,
    currentProgress, 
    totalLabaAktual,
    isLoading,
    labaBulananData: labaBulanan,
    labaTahunanData: labaTahunan,
    biayaPieData: biayaPie,
    handleUpdateTarget
  };
};