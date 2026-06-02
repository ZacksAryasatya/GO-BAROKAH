import { useState, useMemo, useCallback } from 'react';

const LIST_KATEGORI = ['Semua', 'Makanan', 'Minuman', 'Sembako'];
const ITEMS_PER_PAGE = 5;

export const useProductAnalysis = () => {
  const [masterDataProduk] = useState([
    { id: 1, nama: "Indomie Goreng", supplier: "Indofood", kategori: "Makanan", stok: 100, harga: 115000, terjual: 450, status: "Tersedia" },
    { id: 2, nama: "Indomie Soto", supplier: "Indofood", kategori: "Makanan", stok: 10, harga: 115000, terjual: 380, status: "Menipis" },
    { id: 3, nama: "Aqua 600ml", supplier: "Danone", kategori: "Minuman", stok: 150, harga: 45000, terjual: 600, status: "Tersedia" },
    { id: 4, nama: "Teh Pucuk Harum", supplier: "Mayora", kategori: "Minuman", stok: 8, harga: 52000, terjual: 510, status: "Menipis" },
    { id: 5, nama: "Beras Mawar 10kg", supplier: "Lokal", kategori: "Sembako", stok: 45, harga: 145000, terjual: 210, status: "Tersedia" },
    { id: 6, nama: "Minyak Goreng Bimoli 2L", supplier: "Indofood", kategori: "Sembako", stok: 0, harga: 38000, terjual: 340, status: "Habis" },
    { id: 7, nama: "Kopi Kapal Api", supplier: "Santos", kategori: "Minuman", stok: 85, harga: 25000, terjual: 190, status: "Tersedia" },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('Semua');
  const [currentPage, setCurrentPage] = useState(1);

  const ringkasanAnalisis = useMemo(() => {
    return masterDataProduk.reduce((acc, item) => {
      acc.totalProduk += 1;
      acc.totalStok += item.stok;
      acc.totalNilaiAset += item.stok * item.harga;
    
      if (item.status === "Menipis") acc.produkMenipis += 1;
      if (item.status === "Habis") acc.produkHabis += 1;
      
      return acc;
    }, { totalProduk: 0, totalStok: 0, totalNilaiAset: 0, produkMenipis: 0, produkHabis: 0 });
  }, [masterDataProduk]);

  const grafikBatangData = useMemo(() => {
    return [...masterDataProduk]
      .sort((a, b) => b.terjual - a.terjual)
      .slice(0, 5)
      .map(item => ({ name: item.nama, 'Total Terjual': item.terjual }));
  }, [masterDataProduk]);

  const grafikPieData = useMemo(() => {
    const sebaran = masterDataProduk.reduce((acc, item) => {
      acc[item.kategori] = (acc[item.kategori] || 0) + item.stok;
      return acc;
    }, {});
    
    const colors = ['#265345', '#3b82f6', '#f59e0b', '#ef4444'];
    return Object.keys(sebaran).map((kategori, idx) => ({
      name: kategori,
      value: sebaran[kategori],
      color: colors[idx % colors.length]
    }));
  }, [masterDataProduk]);

  const filteredProduk = useMemo(() => {
    const cleanSearch = searchTerm.toLowerCase().trim();
    
    return masterDataProduk.filter(produk => {
      const matchSearch = !cleanSearch || 
                          produk.nama.toLowerCase().includes(cleanSearch) || 
                          produk.supplier.toLowerCase().includes(cleanSearch);
      const matchKategori = selectedKategori === 'Semua' || produk.kategori === selectedKategori;
      
      return matchSearch && matchKategori;
    });
  }, [searchTerm, selectedKategori, masterDataProduk]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProduk.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProduk, currentPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredProduk.length / ITEMS_PER_PAGE);
  }, [filteredProduk.length]);

  const handleSearchChange = useCallback((val) => {
    setSearchTerm(val);
    setCurrentPage(1);
  }, []);

  const handleKategoriChange = useCallback((kat) => {
    setSelectedKategori(kat);
    setCurrentPage(1);
  }, []);

  return {
    searchTerm,
    selectedKategori,
    currentPage,
    totalPages,
    itemsPerPage: ITEMS_PER_PAGE,
    listKategori: LIST_KATEGORI,
    ringkasanAnalisis,
    grafikBatangData,
    grafikPieData,
    paginatedData,
    setCurrentPage,
    handleSearchChange,
    handleKategoriChange
  };
};