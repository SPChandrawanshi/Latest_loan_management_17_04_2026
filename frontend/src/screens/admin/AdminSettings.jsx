import React, { useState, useMemo } from 'react';
import { 
  Settings as SettingsIcon, Save, RefreshCw, Layers, Shield, Percent, 
  Clock, Briefcase, Zap, AlertTriangle, CheckCircle2, Sliders, Activity, 
  Database, History, Cpu, Globe, Lock, Key, RotateCcw, ShieldAlert, Trash2, 
  Terminal, Server, ChevronRight
} from 'lucide-react';
import { PageTitle, Btn, StatCard, Divider, Select } from '../../components/UI';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    default_interest: '10',
    default_late_fee: '2',
    default_agent_percentage: '5',
    default_grace_days: '3'
  });
  const [feeForm, setFeeForm] = useState({
    feeType: 'INITIATION',
    amount: '50',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setMessage({ type: 'success', text: 'System configuration synchronized successfully.' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }, 1000);
  };

  const handleWipe = () => {
    if (window.confirm("CRITICAL: This will irreversibly purge the institutional data vault. Proceed?")) {
      setIsSaving(true);
      setTimeout(() => {
        setIsSaving(false);
        alert("System environment reset to factory defaults.");
      }, 2000);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <PageTitle 
        title="Institutional Orcherstration" 
        subtitle="Manage global interest yield, processing fees, and core system parameters" 
        action={
           <Btn variant="outline" size="md">
              <RotateCcw size={16} className="mr-2" /> Synch Parameters
           </Btn>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
         <div className="xl:col-span-2 space-y-8">
            <form onSubmit={handleSave} className="pro-card p-10 bg-white border border-slate-100 shadow-sm space-y-10 group">
               <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
                     <Sliders size={20} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-800 tracking-tight">Financial Policy Module</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 italic">Global yield and risk share constants</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                     <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Global Interest Rate (%)</label>
                     <input className="premium-input h-12" type="number" value={settings.default_interest} onChange={e => setSettings(s => ({...s, default_interest: e.target.value}))} />
                  </div>

                  <div className="space-y-2">
                     <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Late Penalty Buffer (%)</label>
                     <input className="premium-input h-12" type="number" value={settings.default_late_fee} onChange={e => setSettings(s => ({...s, default_late_fee: e.target.value}))} />
                  </div>

                  <div className="space-y-2">
                     <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Agent Participation (%)</label>
                     <input className="premium-input h-12" type="number" value={settings.default_agent_percentage} onChange={e => setSettings(s => ({...s, default_agent_percentage: e.target.value}))} />
                  </div>

                  <div className="space-y-2">
                     <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Grace Latency (Days)</label>
                     <input className="premium-input h-12" type="number" value={settings.default_grace_days} onChange={e => setSettings(s => ({...s, default_grace_days: e.target.value}))} />
                  </div>
               </div>

               {message.text && (
                  <div className={`p-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 animate-in fade-in ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    <CheckCircle2 size={16} />
                    {message.text}
                  </div>
               )}

               <div className="pt-6 border-t border-slate-50 flex justify-end">
                  <Btn type="submit" loading={isSaving} className="px-10 h-14">
                     Apply New Configuration
                  </Btn>
               </div>
            </form>

            <form onSubmit={handleSave} className="pro-card p-10 bg-white border border-slate-100 shadow-sm space-y-10 group">
               <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
                     <Layers size={20} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-800 tracking-tight">Administrative Fees</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 italic">Transaction egress and ingress charges</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                     <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Deduction Protocol</label>
                     <Select 
                        value={feeForm.feeType}
                        onChange={e => setFeeForm(f => ({...f, feeType: e.target.value}))}
                      >
                        <option value="INITIATION">Deduct from Principal</option>
                        <option value="DELIVERY">Add to Loan Amount</option>
                      </Select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Processing Fee ($)</label>
                     <input className="premium-input h-12" type="number" value={feeForm.amount} onChange={e => setFeeForm(f => ({...f, amount: e.target.value}))} />
                  </div>
               </div>

               <div className="pt-6 border-t border-slate-50 flex justify-end">
                  <Btn type="submit" className="px-10 h-14 !bg-slate-900">
                     Update Fee Matrix
                  </Btn>
               </div>
            </form>
         </div>

         <div className="space-y-8">
            <div className="pro-card p-8 relative overflow-hidden group">
               <div className="relative z-10 space-y-8">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                        <Cpu size={20} />
                     </div>
                     <div>
                        <h4 className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-300 italic">Core Status</h4>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-900 mt-1 italic">Network Telemetry</p>
                     </div>
                  </div>

                  <div className="space-y-5">
                    {[
                      { label: 'Cloud Stability', value: 'Optimal', icon: Globe, color: 'text-emerald-500' },
                      { label: 'Node Latency', value: '0.4ms', icon: Zap, color: 'text-primary' },
                      { label: 'Vault Integrity', value: '100%', icon: Database, color: 'text-emerald-500' },
                      { label: 'Clock Sync', value: 'Stratum 1', icon: RefreshCw, color: 'text-primary' }
                    ].map((s, i) => (
                      <div key={i} className="flex justify-between items-center border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                         <div className="flex items-center gap-3">
                            <s.icon size={12} className="text-slate-300" />
                            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 italic">{s.label}</span>
                         </div>
                         <span className={`text-[10px] font-bold uppercase tracking-widest italic ${s.color}`}>{s.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-8 border-t border-slate-50">
                     <p className="text-[9px] font-bold uppercase tracking-widest text-slate-300 mb-1">Architecture Node</p>
                     <p className="text-base font-bold italic tracking-tight uppercase text-slate-900">v14.2.0-STABLE</p>
                  </div>
               </div>
            </div>

            <div className="pro-card p-8 text-center group">
               <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-300 mx-auto flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-all shadow-sm rotate-12 group-hover:rotate-0">
                  <Trash2 size={24} />
               </div>
               <div className="mt-6 mb-8">
                  <h4 className="text-lg font-bold text-slate-900 tracking-tight italic">Factory Override</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-3 leading-relaxed px-2 italic">Purge all institutional records and reset system to zero-state.</p>
               </div>
               <Btn onClick={handleWipe} className="w-full h-14 !bg-rose-600 hover:!bg-rose-700">
                  Purge Data Vault
               </Btn>
            </div>
         </div>
      </div>
    </div>
  );
}


