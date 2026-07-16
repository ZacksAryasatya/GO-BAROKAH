export const formatRupiah = (amount) => {
  const numericValue = Number(amount); 
  
  if (!numericValue || isNaN(numericValue)) return "Rp 0";
  
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericValue);
};

export const formatNumber = (num) => 
  (Number(num) || 0).toLocaleString("id-ID");

export const stockPercent = (current, max = 100) => {
  const safeMax = max <= 0 ? 100 : max;
  return Math.min(Math.round((current / safeMax) * 100), 100);
};

export const stockBarColor = (percent) => {
  if (percent <= 20) return "bg-red-400";
  if (percent <= 50) return "bg-amber-400";
  return "bg-emerald-400";
};