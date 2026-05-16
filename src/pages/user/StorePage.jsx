import React, { useState, useEffect } from 'react';
import { useStoreLogic } from '../../hooks/user/useStoreLogic';
import ProductCard from '../../components/common/ProductCard';
import FilterSidebar from '../../components/features/FilterSidebar';
import { ShoppingBasket, LayoutGrid, SlidersHorizontal, X } from 'lucide-react';

const StorePage = () => {
  const {
    filter, categories, filteredData, totalCount,
    currentLimit, handleFilterChange, loadMore, clearFilter,
    isLoading
  } = useStoreLogic();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isFilterOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setIsFilterOpen(false), 280); 
  };

  return (
    <div className="bg-[#F6F8F7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-4 sm:py-6">
        <header className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-gray-200/60">
          <div className="max-w-xl">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tighter">
              Katalog <span className="text-[#2D5A43]">Produk.</span>
            </h1>
            <p className="text-gray-500 font-medium text-xs mt-1">
              Bahan makanan segar langsung dari petani pilihan untuk dapur Anda.
            </p>
          </div>

          <div className="mt-3 sm:mt-0 flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white rounded-2xl shadow-sm border border-gray-100">
              <LayoutGrid size={14} className="text-[#2D5A43]" />
              <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">
                {isLoading ? "Loading..." : `${filteredData?.length || 0} / ${totalCount || 0} Items`}
              </span>
            </div>
            <button
              onClick={() => setIsFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3 py-2 bg-white rounded-2xl shadow-sm border border-gray-100 active:scale-95 transition-transform"
            >
              <SlidersHorizontal size={14} className="text-[#2D5A43]" />
              <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Filter</span>
              {filter.length > 0 && (
                <span className="bg-[#2D5A43] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {filter.length}
                </span>
              )}
            </button>
          </div>
        </header>
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
          <aside className="hidden lg:block lg:w-60 flex-shrink-0">
            <div className="sticky top-8">
              <FilterSidebar
                categories={categories}
                activeFilters={filter}
                onFilterChange={handleFilterChange}
                onClear={clearFilter}
              />
            </div>
          </aside>
          <main className="flex-1 min-w-0">
            {isLoading && (!filteredData || filteredData.length === 0) ? (
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-px bg-gray-200 border border-gray-200 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white p-4 animate-pulse">
                    <div className="bg-gray-100 aspect-square rounded-2xl mb-4"></div>
                    <div className="h-4 w-3/4 bg-gray-100 rounded"></div>
                  </div>
                ))}
              </div>
            ) : filteredData && filteredData.length > 0 ? (
              <>
                <div className="grid grid-cols-2 xl:grid-cols-3 gap-px bg-gray-200 border border-gray-200 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-sm shadow-emerald-900/5">
                  {filteredData.map((product) => (
                    <div key={product.id} className="bg-white p-0">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>

                {currentLimit < totalCount && (
                  <div className="mt-8 sm:mt-12 flex justify-center">
                    <button
                      onClick={loadMore}
                      className="bg-white border-2 border-gray-900 px-8 sm:px-10 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all active:scale-95"
                    >
                      Load More
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="py-16 sm:py-20 text-center bg-white rounded-[2rem] sm:rounded-[2.5rem] border border-dashed border-gray-200">
                <ShoppingBasket className="mx-auto text-gray-200 mb-4" size={48} />
                <p className="text-gray-400 font-bold">Produk tidak ditemukan</p>
              </div>
            )}
          </main>
        </div>
      </div>
      {isFilterOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden flex"
          style={{
            backgroundColor: isVisible ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0)',
            transition: 'background-color 0.28s ease',
          }}
          onClick={handleClose}
        >
          <div
            className="relative h-full w-72 max-w-[85vw] bg-white flex flex-col"
            style={{
              transform: isVisible ? 'translateX(0)' : 'translateX(-100%)',
              transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              borderRight: '0.5px solid rgba(0,0,0,0.06)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <SlidersHorizontal size={15} className="text-[#2D5A43]" strokeWidth={2.5} />
                <span className="font-black text-[11px] uppercase tracking-[0.15em] text-[#2D5A43]">
                  Filter
                </span>
                {filter.length > 0 && (
                  <span className="bg-[#2D5A43] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {filter.length}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {filter.length > 0 && (
                  <button
                    onClick={clearFilter}
                    className="text-[9px] text-red-400 font-bold uppercase tracking-wider hover:text-red-500 transition-colors"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={handleClose}
                  className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <X size={14} className="text-gray-500" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] mb-3">
                Kategori
              </p>
              <FilterSidebar
                categories={categories}
                activeFilters={filter}
                onFilterChange={handleFilterChange}
                onClear={clearFilter}
                hideHeader 
              />
            </div>
            <div className="px-5 py-5 border-t border-gray-100">
              <button
                onClick={handleClose}
                className="w-full bg-[#2D5A43] text-white py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest active:scale-[0.98] transition-transform"
              >
                Tampilkan Hasil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StorePage;