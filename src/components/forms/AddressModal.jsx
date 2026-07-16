import React, { useState, useEffect } from "react";
import { X, MapPin, LocateFixed, Search, Loader2 } from "lucide-react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import FormInput from "../common/FormInput";
import FormTextarea from "../common/FormTextarea";
import Button from "../common/Button";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const AddressModal = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onChange,
  isEdit,
  isLoading,
}) => {
  const [position, setPosition] = useState([-2.689, 111.621]);
  const [animate, setAnimate] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const timer = setTimeout(() => setAnimate(true), 10);
      return () => clearTimeout(timer);
    } else {
      setAnimate(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (isEdit && formData.latitude && formData.longitude) {
        setPosition([formData.latitude, formData.longitude]);
      } else {
        setPosition([-2.689, 111.621]);
      }
    }
  }, [isOpen, isEdit]); 

  const LocationPicker = () => {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
      },
    });
    return <Marker position={position} />;
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Browser kamu nggak support fitur GPS bro.");
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
        setIsLocating(false);
      },
      (err) => {
        console.error("Gagal dapet GPS:", err);
        alert("Gagal ambil lokasi. Pastiin GPS nyala dan browser diijinin akses lokasi ya.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSearchAddress = async (searchText) => {
    if (!searchText || searchText.trim().length < 3) return;
    
    setIsSearching(true);
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchText)}&countrycodes=id&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        setPosition([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
      } 
    } catch (error) {
      console.error("Geocoding error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const RecenterMap = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
      map.setView([lat, lng], 18);
    }, [lat, lng]);
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payloadToBackend = {
      ...formData,
      latitude: position[0],
      longitude: position[1],
    };
    onSubmit(payloadToBackend);
  };

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          animate ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <div
        className={`relative bg-white w-full max-w-xl rounded-[40px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform ${
          animate
            ? "scale-100 translate-y-0 opacity-100"
            : "scale-90 translate-y-10 opacity-0"
        }`}
      >
        <div className="p-6 px-10 border-b border-gray-50 flex justify-between items-center bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-green-50 text-[#2D5A43] rounded-xl">
              <MapPin size={20} />
            </div>
            <h3 className="text-xl font-black text-gray-900 tracking-tighter uppercase">
              {isEdit ? "Ubah Alamat" : "Tambah Alamat Baru"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
          >
            <X
              size={20}
              className="text-gray-400 group-hover:rotate-90 transition-transform duration-300"
            />
          </button>
        </div>
        
        <form
          onSubmit={handleSubmit}
          className="p-10 space-y-6 overflow-y-auto flex-grow text-left"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Label Alamat"
              name="label"
              placeholder="Rumah / Kantor"
              value={formData.label ?? ""}
              onChange={onChange}
              required
            />
            <FormInput
              label="Nama Penerima"
              name="recipient_name"
              value={formData.recipient_name ?? ""}
              onChange={onChange}
              placeholder="Nama Lengkap"
              required
            />
          </div>
          <FormInput
            label="No. Telepon"
            name="recipient_phone"
            value={formData.recipient_phone ?? ""}
            onChange={onChange}
            placeholder="0812xxxx"
            required
          />

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                Titik Lokasi Pengiriman (Geser Pin Jika Kurang Pas)
              </label>
              
              <button
                type="button"
                onClick={handleCurrentLocation}
                disabled={isLocating}
                className="text-[10px] uppercase font-bold text-[#2D5A43] bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <LocateFixed size={12} />
                {isLocating ? "Mencari GPS..." : "Gunakan Lokasi Saya"}
              </button>
            </div>
            
            <div className="h-52 w-full rounded-[2rem] overflow-hidden border border-gray-100 z-0">
              <MapContainer
                center={position}
                zoom={16}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.esri.com/">Esri</a> i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                />
                <LocationPicker />
                <RecenterMap lat={position[0]} lng={position[1]} />
              </MapContainer>
            </div>
          </div>

          <div className="space-y-2 relative">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest block">
              Detail Alamat (Nama Jalan, RT/RW, Kelurahan)
            </label>
            <div className="relative group">
              <FormTextarea
                name="address_detail"
                value={formData.address_detail ?? ""}
                onChange={onChange}
                onBlur={(e) => handleSearchAddress(e.target.value)}
                placeholder="Contoh: Jl. Jend Sudirman No. 10, RT 01/02..."
                className="pr-14 min-h-[80px]"
                required
              />
              <button
                type="button"
                onClick={() => handleSearchAddress(formData.address_detail)}
                disabled={isSearching}
                className="absolute right-4 top-4 p-2 text-gray-400 hover:text-[#2D5A43] transition-colors bg-gray-50 rounded-xl disabled:opacity-50 flex items-center justify-center"
              >
                {isSearching ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-2 relative">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest block">
              Catatan Untuk Kurir (Opsional)
            </label>
            <FormTextarea
              name="courier_note"
              value={formData.courier_note ?? ""}
              onChange={onChange}
              placeholder="Contoh: Rumah pagar hitam, tolong titip di pos satpam aja kalau kosong..."
              className="min-h-[80px]"
            />
          </div>
          
          <div className="flex gap-4 pt-6 sticky bottom-0 bg-white border-t border-gray-50">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-4 font-black text-gray-400 uppercase text-[10px] tracking-widest disabled:opacity-50"
            >
              Batal
            </button>

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="flex-[2] py-4 rounded-2xl shadow-xl shadow-green-900/10"
            >
              {isEdit ? "Simpan Perubahan" : "Tambah Alamat Baru"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressModal;