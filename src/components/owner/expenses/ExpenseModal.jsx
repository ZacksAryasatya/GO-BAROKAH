import React, { useState, useEffect } from "react";
import { X, Calendar as CalendarIcon, UploadCloud, FileType, CheckCircle2 } from "lucide-react";
import Button from "../../common/Button";
import DatePicker from "../../common/DatePicker";
import CustomSelect from "../../common/CustomSelect";

const INITIAL_FORM = {
  category: "OTHER",
  description: "",
  amount: 0,
  date: new Date().toISOString().split('T')[0],
};

const CATEGORIES = [
  { value: "SALARY", label: "Gaji (Salary)" },
  { value: "RENT", label: "Sewa (Rent)" },
  { value: "UTILITIES", label: "Utilitas (Listrik/Air)" },
  { value: "DEPRECIATION", label: "Penyusutan" },
  { value: "TAX", label: "Pajak (Tax)" },
  { value: "OTHER", label: "Lainnya" },
];

const ExpenseModal = ({
  mode, initial = null, onClose, onSubmit
}) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [animate, setAnimate] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
        date: initial.date ? initial.date.split('T')[0] : new Date().toISOString().split('T')[0]
      });
    } else {
      setForm(INITIAL_FORM);
    }
  }, [mode, initial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === "amount" ? Number(value) || 0 : value
    }));
  };

  const handleClose = () => {
    setAnimate(false);
    setTimeout(onClose, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const res = await onSubmit(form);
    setIsSaving(false);
    if (res?.success) handleClose();
  };

  if (!shouldRender) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${animate ? "opacity-100" : "opacity-0"}`}>
      <div className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-all duration-300 ${animate ? "opacity-100" : "opacity-0"}`} onClick={handleClose} />
      
      <div className={`relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all duration-300 ${animate ? "scale-100 translate-y-0" : "scale-95 translate-y-4"}`}>
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">
              {mode === "add" ? "Tambah Pengeluaran" : "Edit Pengeluaran"}
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Catat operasional toko
            </p>
          </div>
          <button onClick={handleClose} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="expense-form" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Kategori</label>
              <CustomSelect
                name="category"
                value={form.category}
                onChange={handleChange}
                options={CATEGORIES}
                placeholder="Pilih Kategori"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Deskripsi</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Contoh: Gaji karyawan bulan Juni..."
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm font-bold rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:font-medium placeholder:text-slate-400 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Nominal (Rp)</label>
                <input
                  type="number"
                  name="amount"
                  value={form.amount || ""}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm font-bold rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:font-medium placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Tanggal</label>
                <div className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all">
                  <DatePicker
                    value={form.date}
                    onChange={(date) => handleChange({ target: { name: 'date', value: date } })}
                    className="text-slate-800 text-sm font-bold"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-3xl mt-auto">
          <Button variant="secondary" onClick={handleClose} disabled={isSaving} className="px-6 py-2.5 rounded-xl text-xs">
            Batal
          </Button>
          <Button
            type="submit"
            form="expense-form"
            disabled={isSaving}
            className="px-8 py-2.5 rounded-xl text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/30"
          >
            {isSaving ? "Menyimpan..." : mode === "add" ? "Simpan" : "Perbarui"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseModal;
