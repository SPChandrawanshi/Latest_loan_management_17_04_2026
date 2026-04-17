import React from 'react';
import { AlertCircle, ChevronRight, Loader2, X, Activity } from 'lucide-react';

/** ── Status Badge ── */
export function StatusBadge({ status, onClick }) {
  const specificMappings = {
    'approved': { bg: '#f0fdf4', text: '#16a34a', border: '#dcfce7' }, 
    'verified': { bg: '#f0fdf4', text: '#16a34a', border: '#dcfce7' }, 
    'pending':  { bg: '#fffbeb', text: '#d97706', border: '#fef3c7' }, 
    'rejected': { bg: '#fef2f2', text: '#dc2626', border: '#fee2e2' }, 
    'paid':     { bg: '#f0f9ff', text: '#0284c7', border: '#e0f2fe' }, 
    'late':     { bg: '#fff7ed', text: '#ea580c', border: '#ffedd5' }, 
    'active':   { bg: '#ecfdf5', text: '#059669', border: '#d1fae5' }, 
  };

  const s = specificMappings[status?.toLowerCase()] || { bg: '#f8fafc', text: '#64748b', border: '#f1f5f9' };

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all border ${onClick ? 'cursor-pointer hover:shadow-sm' : 'cursor-default'}`}
      style={{ backgroundColor: s.bg, color: s.text, borderColor: s.border }}
    >
      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.text }} />
      {status}
    </button>
  );
}

/** ── Stat Card ── */
export function StatCard({ label, value, color = '#0f172a', icon: Icon, trend }) {
  return (
    <div className="pro-card group">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="stat-label">{label}</p>
          <p className="text-2xl font-black tracking-tight" style={{ color: color }}>{value}</p>
        </div>
        
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300">
            <Icon size={18} />
          </div>
        )}
      </div>

      {trend && (
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-50">
          <div className="px-2 py-0.5 rounded-lg bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
            <Activity size={12} className="text-primary" />
            {trend}
          </div>
        </div>
      )}
    </div>
  );
}

/** ── Inputs ── */
export function FormField({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label>{label}</label>}
      {children}
      {error && (
        <div className="flex items-center gap-2 text-rose-500 ml-1 mt-0.5 animate-in fade-in slide-in-from-top-1">
          <AlertCircle size={12} />
          <p className="text-[11px] font-bold tracking-tight">{error}</p>
        </div>
      )}
    </div>
  );
}

export function Input({ className = '', ...props }) {
  return (
    <input
      className={`premium-input ${className}`}
      {...props}
    />
  );
}

export function Select({ className = '', children, ...props }) {
  return (
    <div className="relative group">
      <select
        className={`premium-input appearance-none pr-10 ${className}`}
        {...props}
      >
        {children}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
        <ChevronRight size={16} className="rotate-90" />
      </div>
    </div>
  );
}

/** ── Buttons ── */
export function Btn({ children, variant = 'primary', size = 'md', className = '', loading = false, disabled = false, ...props }) {
  const base = 'inline-flex items-center justify-center font-bold uppercase tracking-widest transition-all duration-300 active:scale-95 disabled:opacity-50 select-none';
  
  const sizes = { 
    sm: 'px-4 py-2 text-[10px] rounded-lg', 
    md: 'px-6 py-3.5 text-[11px] rounded-xl', 
    lg: 'px-10 py-4 text-xs rounded-xl shadow-lg' 
  };

  const variants = {
    primary:  'bg-primary text-white hover:bg-primary-hover shadow-md shadow-primary/20',
    danger:   'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-100',
    success:  'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white border border-emerald-100',
    ghost:    'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900',
    outline:  'bg-white text-slate-600 border border-slate-200 hover:border-primary hover:text-primary'
  };

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : children}
    </button>
  );
}

/** ── Layout Helpers ── */
export function PageTitle({ title, subtitle, action }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-4 border-b border-slate-100">
      <div className="space-y-1">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 font-medium">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function Divider({ text, className = '' }) {
  return (
    <div className={`relative flex items-center py-6 ${className}`}>
      <div className="flex-grow border-t border-slate-100"></div>
      {text && <span className="flex-shrink mx-4 text-[10px] font-bold text-slate-300 uppercase tracking-widest">{text}</span>}
      <div className="flex-grow border-t border-slate-100"></div>
    </div>
  );
}

/** ── Loader & Empty State ── */
export function Loader({ full = false }) {
  return (
    <div className={`flex items-center justify-center p-20 ${full ? 'h-screen w-full fixed inset-0 bg-white/90 backdrop-blur-md z-[100]' : ''}`}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
           <Loader2 className="w-5 h-5 text-primary animate-spin" />
        </div>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Syncing...</p>
      </div>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="pro-card flex flex-col items-center justify-center text-center p-20">
      <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 mb-6">
        {Icon ? <Icon size={32} /> : <AlertCircle size={32} />}
      </div>
      <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-1">{title}</h3>
      {description && <p className="text-sm text-slate-400 max-w-sm leading-relaxed mb-8">{description}</p>}
      {action}
    </div>
  );
}

/** ── Table System ── */
export function ProTable({ headers, columns, data, children, loading, onRowClick }) {
  const hasRows = (data && data.length > 0) || children;
  const finalHeaders = headers || columns?.map(c => ({ 
    label: c.header, 
    className: c.align === 'right' ? 'text-right' : c.align === 'center' ? 'text-center' : '' 
  })) || [];

  return (
    <div className="pro-card !p-0">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50">
              {finalHeaders.map((h, i) => (
                <th key={i} className={`px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest ${h.className || ''}`}>
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr>
                <td colSpan={finalHeaders.length || 1} className="py-20 text-center"><Loader /></td>
              </tr>
            ) : !hasRows ? (
              <tr>
                <td colSpan={finalHeaders.length || 1} className="py-20 text-center text-slate-300 text-[11px] font-bold uppercase tracking-widest">
                  No records found
                </td>
              </tr>
            ) : data && columns ? (
              data.map((row, rowIndex) => (
                <tr 
                  key={rowIndex} 
                  onClick={() => onRowClick?.(row)}
                  className={`group transition-all ${onRowClick ? 'cursor-pointer hover:bg-slate-50/50' : ''}`}
                >
                  {columns.map((col, colIndex) => (
                    <td 
                      key={colIndex} 
                      className={`px-6 py-5 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''}`}
                    >
                      {col.render ? col.render(row) : (
                        <span className="text-sm font-bold text-slate-700">{row[col.key]}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              children
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** ── Modal ── */
export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null;
  const sizes = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl', xl: 'max-w-6xl' };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      <div className={`bg-white rounded-3xl shadow-2xl relative w-full ${sizes[size]} z-10 animate-in zoom-in-95 duration-300 overflow-hidden`}>
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50">
          <h3 className="text-xl font-bold text-slate-900">{title}</h3>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-50 text-slate-400 transition-all">
            <X size={18} />
          </button>
        </div>
        <div className="p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}
