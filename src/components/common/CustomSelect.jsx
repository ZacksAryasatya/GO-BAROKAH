import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const CustomSelect = ({ name, value, onChange, options, placeholder = "Pilih", required }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value || opt.value === Number(value) || opt.value === String(value));

  return (
    <div className="relative" ref={containerRef}>
      <div
        className={`w-full bg-slate-50 border text-sm font-bold rounded-xl px-4 py-3 pr-10 cursor-pointer flex items-center justify-between transition-all ${isOpen ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-white' : 'border-slate-200'} ${selectedOption ? 'text-slate-800' : 'text-slate-400'}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {/* Hidden input for required validation */}
      {required && (
        <input
          tabIndex={-1}
          autoComplete="off"
          style={{ opacity: 0, height: 0, width: 0, position: 'absolute' }}
          value={value}
          required
          onChange={() => {}}
        />
      )}
      
      <div className={`absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden transition-all duration-200 origin-top ${isOpen ? 'opacity-100 scale-y-100 translate-y-0' : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'}`}>
        <div className="max-h-60 overflow-y-auto custom-scrollbar p-1.5">
          {options.map((option) => {
            const isSelected = value === option.value || value === Number(option.value) || value === String(option.value);
            return (
              <div
                key={option.value}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl cursor-pointer text-sm font-medium transition-colors ${isSelected ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                onClick={() => {
                  onChange({ target: { name, value: option.value } });
                  setIsOpen(false);
                }}
              >
                <span className="truncate">{option.label}</span>
                {isSelected && <Check size={16} className="text-emerald-500" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CustomSelect;
