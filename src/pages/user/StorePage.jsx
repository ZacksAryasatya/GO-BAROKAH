import React from 'react';
import { useStoreLogic } from '../../hooks/user/useStoreLogic';
import ProductCard from '../../components/common/ProductCard'; 
import FilterSidebar from '../../components/features/FilterSidebar'; 
import { ShoppingBasket, LayoutGrid, SlidersHorizontal } from 'lucide-react'; 

const StorePage = () => {
  const { 
    filter, categories, filteredData, totalCount, 
    currentLimit, handleFilterChange, loadMore, clearFilter,
    isLoading
  } = useStoreLogic();

  return (
    <div className="bg-[#F6F8F7] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6"> 
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-gray-200/60">
          <div className="max-w-xl">
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter">
              Katalog <span className="text-[#2D5A43]">Produk.</span>
            </h1>
            <p className="text-gray-500 font-medium text-xs mt-1">
              Bahan makanan segar langsung dari petani pilihan untuk dapur Anda.
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center gap-3 px-4 py-2 bg-white rounded-2xl shadow-sm border border-gray-100">
            <LayoutGrid size={14} className="text-[#2D5A43]" />
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">
              {isLoading ? "Loading..." : `${filteredData?.length || 0} / ${totalCount || 0} Items`}
            </span>
          </div>
        </header>
        <div className="flex flex-col lg:flex-row gap-10">
          <aside className="lg:w-60 flex-shrink-0">
            <div className="sticky top-8">
              <FilterSidebar 
                categories={categories} 
                activeFilters={filter} 
                onFilterChange={handleFilterChange} 
                onClear={clearFilter} 
              />
            </div>
          </aside>
          <main className="flex-1">
            {isLoading && (!filteredData || filteredData.length === 0) ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-px bg-gray-200 border border-gray-200 rounded-[2.5rem] overflow-hidden">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white p-4 animate-pulse">
                    <div className="bg-gray-100 aspect-square rounded-2xl mb-4"></div>
                    <div className="h-4 w-3/4 bg-gray-100 rounded"></div>
                  </div>
                ))}
              </div>
            ) : filteredData && filteredData.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-px bg-gray-200 border border-gray-200 rounded-[2.5rem] overflow-hidden shadow-sm shadow-emerald-900/5">
                  {filteredData.map((product) => (
                    <div key={product.id} className="bg-white p-0"> 
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>

                {currentLimit < totalCount && (
                  <div className="mt-12 flex justify-center">
                    <button 
                      onClick={loadMore} 
                      className="bg-white border-2 border-gray-900 px-10 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all active:scale-95"
                    >
                      Load More
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-gray-200">
                  <ShoppingBasket className="mx-auto text-gray-200 mb-4" size={48} />
                  <p className="text-gray-400 font-bold">Produk tidak ditemukan</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default StorePage;