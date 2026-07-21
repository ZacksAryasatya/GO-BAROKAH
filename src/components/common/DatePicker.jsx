import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

const DatePicker = ({ value, onChange, placeholder = "Pilih Tanggal", className = "", align = "left", label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const popoverRef = useRef(null);

  useEffect(() => {
    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        setCurrentMonth(date);
      }
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const startDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const numDays = daysInMonth(year, month);
    const startDay = startDayOfMonth(year, month);

    const days = [];
    const daysOfWeek = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

    // Empty cells
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }

    // Days
    for (let d = 1; d <= numDays; d++) {
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isSelected = value === dateString;
      const isToday = new Date().toISOString().split('T')[0] === dateString;

      days.push(
        <button
          key={d}
          onClick={() => {
            onChange(dateString);
            setIsOpen(false);
          }}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold transition-all
            ${isSelected ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' : 
              isToday ? 'bg-slate-100 text-emerald-600' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          {d}
        </button>
      );
    }

    return (
      <div className={`absolute top-full mt-2 p-4 w-[280px] bg-white rounded-3xl shadow-2xl border border-slate-100 z-50 animate-in fade-in zoom-in-95 duration-200 ${align === 'right' ? 'right-0' : 'left-0'}`}>
        <div className="flex justify-between items-center mb-4">
          <button onClick={handlePrevMonth} className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
            <ChevronLeft size={16} />
          </button>
          <div className="text-[11px] font-black text-slate-800 uppercase tracking-wide">
            {currentMonth.toLocaleString('id-ID', { month: 'long', year: 'numeric' })}
          </div>
          <button onClick={handleNextMonth} className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2 text-center">
          {daysOfWeek.map(day => (
            <div key={day} className="text-[9px] font-black text-slate-400 uppercase tracking-widest w-8 flex items-center justify-center">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>
      </div>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return placeholder;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return placeholder;
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="relative flex-1 w-full" ref={popoverRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex flex-col w-full text-left outline-none rounded-lg px-2 py-1.5 transition-colors ${isOpen ? 'bg-slate-200/70' : 'bg-transparent hover:bg-slate-200/50'} ${className}`}
      >
        {label && <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</span>}
        <div className="flex items-center gap-2 w-full">
          <span className={`flex-1 truncate ${!value ? 'text-slate-400' : ''}`}>{formatDate(value)}</span>
          <CalendarIcon size={14} className="text-slate-400 flex-shrink-0" />
        </div>
      </button>
      
      {isOpen && renderCalendar()}
    </div>
  );
};

export default DatePicker;
