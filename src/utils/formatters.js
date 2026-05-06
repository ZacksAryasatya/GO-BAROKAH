export const formatRupiah = (value) => {
  if (!value) return "Rp 0";
  if (value >= 1_000_000_000_000) {
    return `Rp ${(value / 1_000_000_000_000).toFixed(1).replace(/\.0$/, "")}T`;
  }
  if (value >= 1_000_000_000) {
    return `Rp ${(value / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}jt`;
  }
  if (value >= 1_000) {
    return `Rp ${(value / 1_000).toFixed(0)}rb`;
  }
  
  return `Rp ${value}`;
};
export const formatNumber = (value) =>
  value.toLocaleString("id-ID");
export const stockPercent = (current, max = 100) =>
  Math.min(Math.round((current / max) * 100), 100);
export const stockBarColor = (percent) => {
  if (percent <= 20) return "bg-red-400";
  if (percent <= 50) return "bg-amber-400";
  return "bg-emerald-400";
};