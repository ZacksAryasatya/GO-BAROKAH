import React from 'react';

export const InputField = ({ 
  label, type, name, value, onChange, placeholder, required, disabled, helperText, variant = 'standard' 
}) => {
  const baseInputStyles = "w-full rounded-xl text-xs font-semibold transition-all";
  const stateStyles = disabled 
    ? "border-slate-100 bg-[#f8fafc] text-slate-400 cursor-not-allowed px-3.5 py-2.5" 
    : variant === 'filled'
      ? "border border-slate-200 bg-[#f8fafc] px-3.5 py-2 focus:border-slate-400 focus:bg-white focus:outline-none text-slate-700"
      : "border border-slate-200 bg-white px-3.5 py-2.5 text-[#0f1d37] focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-200";

  return (
    <div className="space-y-1.5 flex-1 w-full">
      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
        {label}
      </label>
      <input 
        type={type}
        name={name}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`${baseInputStyles} ${stateStyles}`}
      />
      {helperText && (
        <span className="text-[11px] text-slate-400 block font-medium leading-relaxed">
          {helperText}
        </span>
      )}
    </div>
  );
};