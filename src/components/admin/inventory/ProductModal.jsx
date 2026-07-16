import React, { useState, useEffect } from "react";
import { X, ImageIcon, Plus, Check, RotateCcw, Tag, Edit2 } from "lucide-react";
import Button from "../../common/Button";

const INITIAL_FORM = {
  name: "",
  description: "",
  category_id: "",
  type_id: "",
  image: null,
  stock: 0,
  price: 0,
  cost: 0,
  discount_amount: 0,
};

const ProductModal = ({
  mode, initial = null, onClose, onSubmit,
  categories = [], types = [],
  onAddCategory, onAddType, 
  onEditCategory, onEditType,
}) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [animate, setAnimate] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [catAction, setCatAction] = useState(null);
  const [typeAction, setTypeAction] = useState(null);
  const [tempValue, setTempValue] = useState("");

  useEffect(() => {
    if (mode) {
      setShouldRender(true);
      const timer = setTimeout(() => setAnimate(true), 10);
      return () => clearTimeout(timer);
    } else {
      setAnimate(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [mode]);

  useEffect(() => {
    if (mode === "edit" && initial) {
      setForm({
        ...initial,
        category_id: initial.category?.id || initial.category_id || "",
        type_id: initial.type?.id || initial.type_id || "",
        discount_amount: initial.discount_amount || 0,
        cost: initial.cost || 0,
      });
    } else {
      setForm(INITIAL_FORM);
    }
  }, [mode, initial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericFields = ["stock", "price", "cost", "discount_amount", "category_id", "type_id"];
    setForm((prev) => ({
      ...prev,
      [name]: numericFields.includes(name) ? (value === "" ? 0 : Number(value)) : value,
    }));
  };

  const handleQuickAction = async (target, action) => {
    if (!tempValue) return;
    setIsSaving(true);
    try {
      if (target === "category") {
        if (action === "add") {
          const res = await onAddCategory({ name: tempValue });
          setForm((prev) => ({ ...prev, category_id: res.id || res.data?.id }));
        } else if (action === "edit") {
          await onEditCategory(form.category_id, { name: tempValue });
        }
        setCatAction(null);
      } else {
        if (action === "add") {
          const res = await onAddType({ name: tempValue });
          setForm((prev) => ({ ...prev, type_id: res.id || res.data?.id }));
        } else if (action === "edit") {
          await onEditType(form.type_id, { name: tempValue });
        }
        setTypeAction(null);
      }
      setTempValue("");
    } catch (err) {
      console.error("Quick Action Error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSubmit(form);
      setAnimate(false);
      setTimeout(onClose, 300);
    } catch (err) {
      console.error("Gagal menyimpan produk:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!shouldRender) return null;

  const inputClass = "w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all font-medium";
  const labelClass = "text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block px-1";
  const quickBtnClass = "p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all flex items-center justify-center border border-emerald-100";

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div
          className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${animate ? "opacity-100" : "opacity-0"}`}
          onClick={isSaving ? null : onClose}
        />

        <form
          onSubmit={handleSubmit}
          className={`relative bg-white w-full max-w-xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all duration-300 transform ${animate ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-10 opacity-0"}`}
        >
          <div className={`flex items-center justify-between px-8 py-6 border-b border-slate-50 shrink-0 bg-white transition-all duration-500 delay-100 ${animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"}`}>
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">
                {mode === "create" ? "Tambah Produk" : "Edit Produk"}
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                Inventaris UD BAROKAH
              </p>
            </div>
            <button type="button" onClick={onClose} disabled={isSaving} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:rotate-90 transition-transform duration-300">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              <div className={`md:col-span-2 transition-all duration-500 delay-[150ms] ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                <label className={labelClass}>Nama Produk</label>
                <input required name="name" type="text" value={form.name} onChange={handleChange} className={inputClass} placeholder="Contoh: Kurma Ajwa" />
              </div>
              
              <div className={`md:col-span-2 transition-all duration-500 delay-[200ms] ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                <label className={labelClass}>Deskripsi Singkat</label>
                <textarea required name="description" rows={2} value={form.description} onChange={handleChange} className={`${inputClass} resize-none`} placeholder="Detail produk..." />
              </div>
              
              {/* KOLOM KATEGORI */}
              <div className={`transition-all duration-500 delay-[250ms] ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                <label className={labelClass}>Kategori</label>
                <div className="flex gap-2">
                  {catAction ? (
                    <>
                      <input autoFocus className={inputClass} placeholder={catAction === "add" ? "Kategori Baru" : "Edit Kategori"} value={tempValue} onChange={(e) => setTempValue(e.target.value)} />
                      <button type="button" onClick={() => handleQuickAction("category", catAction)} className={quickBtnClass}>
                        <Check size={18} />
                      </button>
                      <button type="button" onClick={() => { setCatAction(null); setTempValue(""); }} className="p-3 bg-slate-100 text-slate-400 rounded-xl hover:bg-slate-200 transition-colors">
                        <RotateCcw size={18} />
                      </button>
                    </>
                  ) : (
                    <>
                      <select required name="category_id" value={form.category_id} onChange={handleChange} className={inputClass}>
                        <option value="">Pilih Kategori</option>
                        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                      {form.category_id ? (
                        <button type="button" onClick={() => {
                          setCatAction("edit");
                          const cat = categories.find((c) => String(c.id) === String(form.category_id));
                          setTempValue(cat?.name || "");
                        }} className="p-3 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-100 border border-amber-100 transition-colors">
                          <Edit2 size={18} />
                        </button>
                      ) : (
                        <button type="button" onClick={() => { setCatAction("add"); setTempValue(""); }} className={quickBtnClass}>
                          <Plus size={18} />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
              
              {/* KOLOM SATUAN */}
              <div className={`transition-all duration-500 delay-[300ms] ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                <label className={labelClass}>Satuan</label>
                <div className="flex gap-2">
                  {typeAction ? (
                    <>
                      <input autoFocus className={inputClass} placeholder={typeAction === "add" ? "Satuan Baru" : "Edit Satuan"} value={tempValue} onChange={(e) => setTempValue(e.target.value)} />
                      <button type="button" onClick={() => handleQuickAction("type", typeAction)} className={quickBtnClass}>
                        <Check size={18} />
                      </button>
                      <button type="button" onClick={() => { setTypeAction(null); setTempValue(""); }} className="p-3 bg-slate-100 text-slate-400 rounded-xl hover:bg-slate-200 transition-colors">
                        <RotateCcw size={18} />
                      </button>
                    </>
                  ) : (
                    <>
                      <select required name="type_id" value={form.type_id} onChange={handleChange} className={inputClass}>
                        <option value="">Pilih Satuan</option>
                        {types.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                      {form.type_id ? (
                        <button type="button" onClick={() => {
                          setTypeAction("edit");
                          const typ = types.find((t) => String(t.id) === String(form.type_id));
                          setTempValue(typ?.name || "");
                        }} className="p-3 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-100 border border-amber-100 transition-colors">
                          <Edit2 size={18} />
                        </button>
                      ) : (
                        <button type="button" onClick={() => { setTypeAction("add"); setTempValue(""); }} className={quickBtnClass}>
                          <Plus size={18} />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
              
              <div className={`md:col-span-2 transition-all duration-500 delay-[350ms] ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                <label className={labelClass}>Upload Gambar Produk</label>
                <div className="relative group">
                  <div className={`w-full h-40 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${form.image ? "border-emerald-500 bg-emerald-50" : "border-slate-200 bg-slate-50 hover:border-emerald-300 hover:bg-emerald-50/30"}`}>
                    {form.image ? (
                      <div className="relative w-full h-full p-2">
                        <img
                          src={typeof form.image === "string" ? form.image : URL.createObjectURL(form.image)}
                          className="w-full h-full object-contain rounded-xl"
                          alt="Preview"
                        />
                        <button type="button" onClick={() => setForm((prev) => ({ ...prev, image: null }))} className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors">
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <ImageIcon size={32} className="text-slate-300 mb-2 group-hover:text-emerald-300 transition-colors" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase group-hover:text-emerald-400 transition-colors">Klik untuk pilih file</p>
                        <input type="file" accept="image/*" onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.files[0] }))} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className={`transition-all duration-500 delay-[400ms] ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                <label className={labelClass}>Stok Barang</label>
                <input required name="stock" type="number" value={form.stock} onChange={handleChange} className={inputClass} />
              </div>
              
              <div className={`transition-all duration-500 delay-[425ms] ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                <label className={labelClass}>Harga Pokok / Modal (Rp)</label>
                <input required name="cost" type="number" value={form.cost} onChange={handleChange} className={inputClass} />
              </div>
              
              <div className={`transition-all duration-500 delay-[450ms] ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                <label className={labelClass}>Harga Jual (Rp)</label>
                <input required name="price" type="number" value={form.price} onChange={handleChange} className={inputClass} />
              </div>
              
              <div className={`md:col-span-2 transition-all duration-500 delay-[500ms] ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                <label className={labelClass}>Potongan Harga / Diskon (Rp)</label>
                <div className="relative">
                  <Tag size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input name="discount_amount" type="number" value={form.discount_amount} onChange={handleChange} className={`${inputClass} pl-11`} placeholder="0" />
                </div>
              </div>
              
            </div>
          </div>
          
          <div className={`px-8 py-6 bg-slate-50/50 border-t border-slate-50 flex gap-4 transition-all duration-500 delay-[550ms] ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <button type="button" onClick={onClose} className="flex-1 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-400 bg-white border border-slate-200 hover:bg-slate-50 transition-colors">
              Batal
            </button>
            <Button type="submit" isLoading={isSaving} variant="primary" className="flex-[1.5] py-4 rounded-2xl shadow-xl shadow-green-900/20">
              {mode === "create" ? "Simpan Produk" : "Perbarui Data"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ProductModal;