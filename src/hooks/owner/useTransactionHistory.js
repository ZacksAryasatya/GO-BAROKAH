import { useState, useMemo, useCallback } from 'react';

const ITEMS_PER_PAGE = 5;

export const useTransactionHistory = () => {
  const [masterTransactions] = useState([
    { id: "TXR-001", idPesanan: "ORD-001", pelanggan: "Adika Manis", tanggal: "24/02/2026 14:30", metode: "Transfer Bank", jumlah: 1000000, status: "Berhasil" },
    { id: "TXR-002", idPesanan: "ORD-002", pelanggan: "Rian Perkasa", tanggal: "25/02/2026 09:15", metode: "E-Wallet", jumlah: 250000, status: "Berhasil" },
    { id: "TXR-003", idPesanan: "ORD-003", pelanggan: "Siti Rahma", tanggal: "25/02/2026 11:00", metode: "Transfer Bank", jumlah: 1500000, status: "Menunggu" },
    { id: "TXR-004", idPesanan: "ORD-004", pelanggan: "Budi Santoso", tanggal: "26/02/2026 16:45", metode: "COD", jumlah: 450000, status: "Gagal" },
    { id: "TXR-005", idPesanan: "ORD-005", pelanggan: "Amalia Putri", tanggal: "27/02/2026 10:20", metode: "E-Wallet", jumlah: 300000, status: "Berhasil" },
    { id: "TXR-006", idPesanan: "ORD-006", pelanggan: "Adika Manis", tanggal: "27/02/2026 15:00", metode: "Transfer Bank", jumlah: 1200000, status: "Berhasil" },
  ]);

  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [paymentFilter, setPaymentFilter] = useState('Semua Pembayaran');
  const [currentPage, setCurrentPage] = useState(1);

  const ringkasanTransaksi = useMemo(() => {
    return masterTransactions.reduce((acc, curr) => {
      if (curr.status === "Berhasil") {
        acc.totalNominal += curr.jumlah;
        acc.suksesCount += 1;
        acc.totalItem += 1; 
      } else if (curr.status === "Menunggu") {
        acc.menungguCount += 1;
      } else if (curr.status === "Gagal") {
        acc.gagalCount += 1;
      }
      return acc;
    }, { totalNominal: 0, menungguCount: 0, suksesCount: 0, gagalCount: 0, totalItem: 0 });
  }, [masterTransactions]);

  const filteredTransactions = useMemo(() => {
    const cleanSearch = searchTerm.toLowerCase().trim();

    return masterTransactions.filter(tx => {
      const matchSearch = !cleanSearch || 
                          tx.id.toLowerCase().includes(cleanSearch) || 
                          tx.idPesanan.toLowerCase().includes(cleanSearch) ||
                          tx.pelanggan.toLowerCase().includes(cleanSearch);
                          
      const matchStatus = statusFilter === 'Semua Status' || tx.status === statusFilter;
      const matchPayment = paymentFilter === 'Semua Pembayaran' || tx.metode === paymentFilter;

      return matchSearch && matchStatus && matchPayment;
    });
  }, [searchTerm, statusFilter, paymentFilter, masterTransactions]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredTransactions, currentPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  }, [filteredTransactions.length]);

  const totalRecords = useMemo(() => {
    return filteredTransactions.length;
  }, [filteredTransactions.length]);

  const handleSearch = useCallback((val) => {
    setSearchTerm(val);
    setCurrentPage(1);
  }, []);

  const handleStatusFilter = useCallback((val) => {
    setStatusFilter(val);
    setCurrentPage(1);
  }, []);

  const handlePaymentFilter = useCallback((val) => {
    setPaymentFilter(val);
    setCurrentPage(1);
  }, []);

  return {
    searchTerm,
    statusFilter,
    paymentFilter,
    currentPage,
    totalPages,
    ringkasanTransaksi,
    paginatedData,
    totalRecords,
    setCurrentPage,
    handleSearch,
    handleStatusFilter,
    handlePaymentFilter
  };
};