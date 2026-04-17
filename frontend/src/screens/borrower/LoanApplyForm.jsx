import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  Calendar, 
  FileText, 
  MapPin, 
  MessageCircle, 
  Building, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle,
  ShieldCheck,
  DollarSign,
  ArrowRight,
  Check,
  Info,
  Banknote,
  Building2,
  Wallet
} from 'lucide-react';
import { PageTitle, Btn, Input, Select, FormField, StatCard, Divider, Loader, EmptyState } from '../../components/UI';

const LOAN_AMOUNT_OPTIONS = [
  { value: '5000', label: 'K5,000' },
  { value: '10000', label: 'K10,000' },
  { value: '25000', label: 'K25,000' },
  { value: '50000', label: 'K50,000' },
  { value: '100000', label: 'K100,000' },
];

const LOAN_DURATION_OPTIONS = [3, 6, 9, 12, 18, 24].map((m) => ({
  value: m,
  label: `${m} month${m === 1 ? '' : 's'}`,
}));

function formatMoney(value) {
  return `K${Number(value || 0).toLocaleString()}`;
}

export default function LoanApplyForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    amount: '25000',
    duration: 12,
    description: '',
    method: 'wire',
    bankName: '',
    accountNumber: '',
    accountName: '',
  });

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto py-32 px-6 text-center animate-in zoom-in-95 duration-1000">
        <div className="pro-card p-24 flex flex-col items-center group">
           <div className="w-28 h-28 rounded-[2.5rem] bg-emerald-500 text-white flex items-center justify-center shadow-xl shadow-emerald-500/20 mb-12">
              <CheckCircle size={56} />
           </div>
           <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic mb-6 leading-none">Application Submitted</h2>
           <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest max-w-sm leading-relaxed mb-16 italic">
             Your loan request has been successfully received by our processing team. You will be notified via email once the review is complete.
           </p>
           <Btn onClick={() => navigate('/borrower/dashboard')} className="!h-16 !px-16 italic font-black text-[10px] uppercase tracking-widest">
             Return to Dashboard
           </Btn>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-16 animate-in fade-in duration-1000">
      <PageTitle 
        title="Loan Application" 
        subtitle="Configure your loan requirements and bank details for processing." 
      />

      <div className="flex items-center justify-between px-16 relative">
        <div className="absolute top-7 left-0 w-full h-[2px] bg-slate-50 -z-10" />
        {[
          { id: 1, label: 'Loan Amount' },
          { id: 2, label: 'Bank Details' },
          { id: 3, label: 'Final Review' }
        ].map(s => {
          const isActive = step === s.id;
          const isDone = step > s.id;
          return (
            <div key={s.id} className="flex flex-col items-center group">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-700 ${isActive ? 'bg-slate-900 text-white shadow-2xl rotate-6' : isDone ? 'bg-primary text-white' : 'bg-white text-slate-200 border border-slate-100'}`}>
                {isDone ? <Check size={24} /> : <span className="text-base font-black italic">{s.id}</span>}
              </div>
              <p className={`mt-5 text-[9px] font-black uppercase tracking-[0.3em] italic ${isActive ? 'text-slate-900' : 'text-slate-300'}`}>{s.label}</p>
            </div>
          );
        })}
      </div>

      <div className="pro-card overflow-hidden min-h-[550px] flex flex-col group">
        <div className="p-16 md:p-24 flex-1 flex flex-col">
          {step === 1 && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="space-y-1">
                <h2 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">01 / Loan Details</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic leading-relaxed">Identity Profile & Capital Scope</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
                <FormField label="Desired Amount">
                   <select 
                     value={form.amount} 
                     onChange={e => update('amount', e.target.value)}
                     className="premium-input appearance-none bg-slate-50 border-slate-100 italic font-bold"
                   >
                     {LOAN_AMOUNT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                   </select>
                </FormField>

                <FormField label="Repayment Period">
                   <select 
                     value={form.duration} 
                     onChange={e => update('duration', Number(e.target.value))}
                     className="premium-input appearance-none bg-slate-50 border-slate-100 italic font-bold"
                   >
                     {LOAN_DURATION_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                   </select>
                </FormField>
              </div>

              <FormField label="Purpose of Loan">
                <textarea 
                  rows="4" 
                  placeholder="Tell us more about how you plan to use these funds..." 
                  value={form.description} 
                  onChange={e => update('description', e.target.value)}
                  className="premium-input bg-slate-50 border-slate-100 min-h-[140px] resize-none italic font-bold placeholder:text-slate-200" 
                />
              </FormField>

              <div className="pt-10">
                <Btn onClick={() => setStep(2)} className="w-full !h-16 italic font-black uppercase tracking-widest rounded-2xl">
                  Continue to Details <ArrowRight size={18} className="ml-4" />
                </Btn>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-700">
              <div className="space-y-1">
                <h2 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">02 / Bank Details</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic leading-relaxed">Authorized Registry For Disbursement</p>
              </div>

              <div className="flex p-3 bg-slate-50 rounded-3xl border border-slate-100 shadow-inner">
                 {[
                   { id: 'wire', label: 'Bank Transfer', icon: Building2 },
                   { id: 'cash', label: 'Cash Payment', icon: Banknote }
                 ].map(m => (
                   <button 
                     key={m.id}
                     onClick={() => update('method', m.id)}
                     className={`flex-1 flex items-center justify-center gap-4 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${form.method === m.id ? 'bg-white text-slate-900 shadow-xl border border-slate-50 italic scale-[1.02]' : 'text-slate-300 hover:text-slate-400'}`}>
                     <m.icon size={16} className={form.method === m.id ? 'text-primary' : ''} />
                     {m.label}
                   </button>
                 ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="md:col-span-2">
                  <FormField label="Bank Name">
                    <Input className="italic" placeholder="e.g. Standard Chartered Bank" value={form.bankName} onChange={e => update('bankName', e.target.value)} />
                  </FormField>
                </div>
                <FormField label="Account Number">
                  <Input className="italic" placeholder="e.g. 1029384756" value={form.accountNumber} onChange={e => update('accountNumber', e.target.value)} />
                </FormField>
                <FormField label="Account Holder Name">
                  <Input className="italic" placeholder="As it appears on your statement" value={form.accountName} onChange={e => update('accountName', e.target.value)} />
                </FormField>
              </div>

              <div className="flex gap-6 pt-10">
                <Btn variant="outline" onClick={() => setStep(1)} className="flex-1 !h-16 italic font-black uppercase tracking-widest text-[10px] rounded-2xl">Back</Btn>
                <Btn onClick={() => setStep(3)} className="flex-[2] !h-16 italic font-black uppercase tracking-widest rounded-2xl shadow-primary/20">Review Application <ArrowRight size={18} className="ml-4" /></Btn>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-12 animate-in fade-in zoom-in-95 duration-700">
               <div className="space-y-1">
                <h2 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">03 / Final Registry Review</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic leading-relaxed">Confirm application parameters before submission</p>
              </div>

              <div className="pro-card p-16 bg-slate-50 border border-slate-100 space-y-12 text-center rounded-[2.5rem] relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] italic mb-8 leading-none">Requested Loan Amount</p>
                 <h4 className="text-6xl font-black text-slate-900 tracking-tighter italic leading-none">{formatMoney(form.amount)}</h4>
                 
                 <div className="grid grid-cols-2 gap-10 max-w-sm mx-auto pt-10">
                    <div className="text-left space-y-2 italic">
                       <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none">Period</p>
                       <p className="text-base font-black text-slate-900 leading-none">{form.duration} Months</p>
                    </div>
                    <div className="text-left space-y-2 italic">
                       <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none">Method</p>
                       <p className="text-base font-black text-slate-900 leading-none uppercase">{form.method === 'wire' ? 'Bank Transfer' : 'Cash'}</p>
                    </div>
                 </div>
              </div>

              <div className="flex gap-6 pt-10">
                <Btn variant="outline" onClick={() => setStep(2)} className="flex-1 !h-16 italic font-black uppercase tracking-widest text-[10px] rounded-2xl">Modify Details</Btn>
                <Btn 
                   onClick={() => {
                     setSubmitting(true);
                     setTimeout(() => {
                       setSubmitting(false);
                       setSubmitted(true);
                     }, 1000);
                   }}
                   disabled={submitting}
                   loading={submitting}
                   className="flex-[2] !h-16 italic font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20"
                >
                   Submit Application
                </Btn>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
