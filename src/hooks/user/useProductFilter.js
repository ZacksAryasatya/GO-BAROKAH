export const useProductFilter = (products, search, activeFilters) => {
  return products.filter((p) => {
    const productCat = p.category?.name || p.category; 

    const matchCat = activeFilters.length === 0 || activeFilters.includes(productCat);
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase());
    
    return matchCat && matchSearch;
  });
};