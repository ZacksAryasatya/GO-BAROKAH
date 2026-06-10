import React, { useState, useEffect } from "react";
import { X, Search, MapPin } from "lucide-react";
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
    if (isOpen && isEdit && formData.address_detail) {
      handleSearchLocation(formData.address_detail);
    }
  }, [isOpen, isEdit]);

  const fetchAddressName = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
      );
      const data = await response.json();
      if (data.display_name) {
        onChange({
          target: { name: "address_detail", value: data.display_name },
        });
      }
    } catch (error) {
      console.error("Geocoding Error:", error);
    }
  };

  const LocationPicker = () => {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        fetchAddressName(e.latlng.lat, e.latlng.lng);
      },
    });
    return <Marker position={position} />;
  };

  const handleSearchLocation = async (text) => {
    if (!text || text.length < 5) return;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)}`,
      );
      const data = await response.json();
      if (data && data.length > 0) {
        setPosition([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
      }
    } catch (error) {
      console.error("Search Error:", error);
    }
  };

  const RecenterMap = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
      map.setView([lat, lng], 15);
    }, [lat, lng]);
    return null;
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
          onSubmit={onSubmit}
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
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex justify-between items-center">
              Titik Lokasi Pengiriman
              <span className="text-[10px] lowercase font-medium text-[#2D5A43] bg-green-50 px-3 py-1 rounded-full">
                Klik peta untuk menggeser PIN
              </span>
            </label>
            <div className="h-52 w-full rounded-[2rem] overflow-hidden border border-gray-100 z-0">
              <MapContainer
                center={position}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />
                <LocationPicker />
                <RecenterMap lat={position[0]} lng={position[1]} />
              </MapContainer>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest block">
              Detail Alamat (Jalan, No Rumah, RT/RW)
            </label>
            <div className="relative group">
              <FormTextarea
                name="address_detail"
                value={formData.address_detail ?? ""}
                onChange={onChange}
                onBlur={(e) => handleSearchLocation(e.target.value)}
                placeholder="Jl. G.M. Arsyad No. 10..."
                className="pr-14 min-h-[100px]"
                required
              />
              <button
                type="button"
                onClick={() => handleSearchLocation(formData.address_detail)}
                className="absolute right-4 top-4 p-2 text-gray-400 hover:text-[#2D5A43] transition-colors bg-gray-50 rounded-xl"
              >
                <Search size={18} />
              </button>
            </div>
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
