import React, { useState, useEffect, useRef } from "react";
import { MapPin, ChevronDown } from "lucide-react";

const CustomAddressSelector = ({ 
  userAddresses, 
  selectedAddressId, 
  setSelectedAddressId, 
  alamatDetail, 
  setAlamatDetail, 
  namaPenerima,
  setNamaPenerima 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getSelectedLabel = () => {
    const found = userAddresses.find((a) => a.id?.toString() === selectedAddressId?.toString());
    return found 
      ? `${found.label || "Alamat"} - ${found.recipientName || namaPenerima} (${found.recipientPhone || "No HP"})` 
      : "Pilih alamat pengiriman";
  };

  return (
    <div className="space-y-3">
      <label className="flex items-center gap-1.5 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">
        <MapPin size={11} className="text-[#2D5A43]" /> Pilih Alamat Terdaftar
      </label>
      
      <div className="relative" ref={dropdownRef}>
        <div
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`w-full px-4 py-3.5 pr-10 rounded-2xl bg-gray-50 font-black text-gray-700 cursor-pointer text-sm border transition-all flex items-center justify-between ${
            isDropdownOpen ? 'border-[#2D5A43]/30 bg-white ring-4 ring-[#2D5A43]/5' : 'border-gray-100 hover:border-gray-200'
          }`}
        >
          <span className="truncate">{getSelectedLabel()}</span>
          <ChevronDown 
            size={18} 
            className={`text-gray-400 transition-transform duration-200 shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`} 
          />
        </div>

        {isDropdownOpen && (
          <div className="absolute z-10 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] py-2 max-h-60 overflow-y-auto overflow-x-hidden origin-top animate-in fade-in zoom-in-95 duration-200">
            {userAddresses.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 font-medium text-center">
                Belum ada alamat tersimpan
              </div>
            ) : (
              userAddresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => {
                    setSelectedAddressId(addr.id?.toString());
                    setAlamatDetail(addr.addressDetail || "");
                    const namaBaru = addr.recipientName || addr.name; 
                    if (namaBaru && setNamaPenerima) {
                      setNamaPenerima(namaBaru);
                    }
                    setIsDropdownOpen(false);
                  }}
                  className={`px-4 py-3 cursor-pointer text-sm font-bold transition-colors ${
                    selectedAddressId === addr.id?.toString() ? 'bg-[#E8F5EE] text-[#2D5A43]' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="truncate">
                    {addr.label || "Alamat"} - {addr.recipientName || namaPenerima} ({addr.recipientPhone || "No HP"})
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <textarea
        placeholder="Detail Alamat (Akan terisi otomatis dari pilihan diatas)"
        rows="3"
        className="w-full px-4 py-3.5 mt-1 rounded-2xl bg-gray-50 outline-none font-bold text-gray-800 text-sm border border-gray-100 focus:border-[#2D5A43]/30 focus:bg-white transition-all resize-none"
        value={alamatDetail}
        onChange={(e) => setAlamatDetail(e.target.value)}
      />
    </div>
  );
};

export default CustomAddressSelector;