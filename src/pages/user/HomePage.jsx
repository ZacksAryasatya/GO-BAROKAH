import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CategorySection from '../../components/features/CategorySection';
import DiscountSection from '../../components/features/DiscountSection';
import FeaturedSection from '../../components/features/FeaturedSection';
import ProductSection from '../../components/features/ProductSection';
import { Loader2 } from "lucide-react";
import { useHomeLogic } from "../../hooks/user/useHomeLogic";

const HomePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Midtrans redirect: kalau ada query param dari Midtrans, langsung arahkan ke halaman riwayat pesanan
  useEffect(() => {
    const orderId = searchParams.get("order_id");
    const transactionStatus = searchParams.get("transaction_status");
    if (orderId || transactionStatus) {
      navigate("/profile/orders", { replace: true });
    }
  }, [searchParams, navigate]);
  const { 
    loading, 
    categories, 
    activeFilters, 
    setActiveFilters, 
    toggleFilter, 
    filteredProducts 
  } = useHomeLogic();

  if (loading) {
    return (
      <div className="py-40 flex flex-col items-center justify-center gap-4 bg-[#FBFBFB] min-h-screen">
        <Loader2 className="animate-spin text-[#2D5A43]" size={40} />
        <p className="font-black uppercase tracking-widest text-[10px]">Loading ...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700">

      
      <CategorySection 
        categories={categories}
        activeFilters={activeFilters}
        toggleFilter={toggleFilter}
        setActiveFilters={setActiveFilters}
      />
      
      <DiscountSection filteredProducts={filteredProducts} />
      <FeaturedSection filteredProducts={filteredProducts} />
      <ProductSection filteredProducts={filteredProducts} />
    </div>
  );
};

export default HomePage;