import React, { useState, useMemo, useCallback } from 'react';
import {
   FileText, Search, CheckCircle2, X, Download, ArrowRight, User, Clock,
   Banknote, Briefcase, FileSignature, ShieldCheck
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { PageTitle, StatusBadge, Btn, StatCard, Divider } from '../../components/UI';
import Modal from '../../components/Modal';

const DUMMY_LOANS = [
  { id: 'LN-8801', user: { name: 'Michael Johnson' }, principalAmount: 5000, duration: 12, status: 'PENDING', interestRate: 10, dueDay: 5, agent: null, disbursementMethod: 'cash', deliveryAddress: '14 Oak Avenue', whatsapp: '+260972001122', monthlyPayment: 458 },
  { id: 'LN-8802', user: { name: 'Sarah Williams' }, principalAmount: 8500, duration: 6, status: 'PENDING', interestRate: 10, dueDay: 10, agent: { name: 'James Banda' }, disbursementMethod: 'wire', bankName: 'Zanaco Bank', accountNumber: '0021991028', monthlyPayment: 1491 },
  { id: 'LN-8803', user: { name: 'David Brown' }, principalAmount: 3200, duration: 9, status: 'APPROVED', interestRate: 12, dueDay: 15, agent: null, disbursementMethod: 'cash', monthlyPayment: 373 },
  { id: 'LN-8804', user: { name: 'Emma Thompson' }, principalAmount: 12000, duration: 18, status: 'APPROVED', interestRate: 10, dueDay: 1, agent: { name: 'Clara Phiri' }, monthlyPayment: 710 },
  { id: 'LN-8805', user: { name: 'James Wilson' }, principalAmount: 2500, duration: 6, status: 'PENDING', interestRate: 8, dueDay: 20, agent: null, monthlyPayment: 435 },
];

const DUMMY_AGENTS = [
  { id: 1, name: 'James Banda' },
  { id: 2, name: 'Clara Phiri' },
  { id: 3, name: 'Victor Mwale' },
];

function EmptyState({ title, description, icon: Icon }) {
  return (
    <div className="py-24 text-center space-y-5 flex flex-col items-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto">
        <Icon size={28} className="text-slate-200" />
      </div>
      <div>
        <p className="text-sm font-bold text-slate-800">{title}</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">{description}</p>
      </div>
    </div>
  );
}

export default function StaffLoans() {
   const [searchParams, setSearchParams] = useSearchParams();
   const activeTab = useMemo(() => {
      const t = searchParams.get('tab');
      if (t === 'review') return 'PENDING';
      if (t === 'approved') return 'APPROVED';
      return 'ALL';
   }, [searchParams]);

   const setLoanTab = useCallback((tab) => {
     if (tab === 'ALL') setSearchParams({}, { replace: true });
     else if (tab === 'PENDING') setSearchParams({ tab: 'review' }, { replace: true });
     else if (tab === 'APPROVED') setSearchParams({ tab: 'approved' }, { replace: true });
   }, [setSearchParams]);

   const [loans, setLoans] = useState(DUMMY_LOANS);
   const [search, setSearch] = useState('');
   const [viewModal, setViewModal] = useState(null);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [showSuccess, setShowSuccess] = useState(false);
   const [adminFields, setAdminFields] = useState({
     agentId: '', agentCommissionRate: 5, initiationFeeRate: 0,
     interestRate: 10, latePenaltyRate: 2, graceDays: 3, dueDay: 5
   });

   const filtered = loans.filter(l => {
      const name = l.user?.name || '';
      const matchesSearch = name.toLowerCase().includes(search.toLowerCase()) || String(l.id).includes(search);
      const matchesTab = activeTab === 'ALL' ? true : l.status === activeTab;
      return matchesSearch && matchesTab;
   });

   const handleSetTerms = () => {
      setIsSubmitting(true);
      setTimeout(() => {
        setLoans(prev => prev.map(l => l.id === viewModal.id ? { ...l, status: 'APPROVED' } : l));
        setIsSubmitting(false);
        setShowSuccess(true);
        setTimeout(() => { setViewModal(null); setShowSuccess(false); }, 1800);
      }, 800);
   };

   const handleReject = () => {
      setLoans(prev => prev.filter(l => l.id !== viewModal.id));
      setViewModal(null);
   };

   const handleExport = () => {
      const headers = ['ID', 'Borrower', 'Principal', 'Duration', 'Status'];
      const rows = filtered.map(l => [l.id, l.user?.name, `$${l.principalAmount}`, `${l.duration}m`, l.status]);
      const csv = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const link = document.createElement('a');
      link.setAttribute('href', encodeURI(csv));
      link.setAttribute('download', `loan_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link); link.click(); link.remove();
   };

   return (
      <div className="space-y-8 animate-in fade-in duration-700">
         <PageTitle 
            title={activeTab === 'PENDING' ? 'Pending Reviews' : activeTab === 'APPROVED' ? 'Approved Loans' : 'Loan Registry'}
            subtitle="Complete history of all loan applications and active financial records."
            action={
               <Btn variant="outline" size="md" onClick={handleExport}>
                  <Download size={16} className="mr-2" /> Export Data
               </Btn>
            }
         />

         <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard label="Pending Approvals" value={loans.filter(l => l.status === 'PENDING').length} icon={Clock} color="text-primary" />
            <StatCard label="Active Loans" value={loans.filter(l => l.status === 'APPROVED').length} icon={CheckCircle2} color="text-emerald-500" />
            <StatCard label="System Status" value="Active" icon={ShieldCheck} color="text-slate-900" />
         </section>

         <div className="pro-card shadow-sm overflow-hidden group">
            <div className="p-6 border-b border-slate-50 flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-slate-50/50">
               <div className="flex p-1.5 bg-white rounded-2xl border border-slate-100 gap-1">
                  {[{ id: 'PENDING', label: 'New Requests' }, { id: 'APPROVED', label: 'Approved' }, { id: 'ALL', label: 'All Loans' }].map(tab => (
                     <button
                        key={tab.id}
                        onClick={() => setLoanTab(tab.id)}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-300 hover:text-slate-600'}`}
                     >
                        {tab.label}
                     </button>
                  ))}
               </div>
               <div className="relative w-full xl:w-80 group">
                  <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or ID..." className="premium-input pl-12 h-11" />
               </div>
            </div>

            <div className="overflow-x-auto min-h-[400px]">
               <table className="w-full border-collapse">
                  <thead>
                     <tr className="bg-white border-b border-slate-50">
                        <th className="px-8 py-5 text-left text-[10px] font-bold text-slate-300 uppercase tracking-widest">Customer</th>
                        <th className="px-8 py-5 text-left text-[10px] font-bold text-slate-300 uppercase tracking-widest">Principal</th>
                        <th className="px-8 py-5 text-left text-[10px] font-bold text-slate-300 uppercase tracking-widest">Monthly</th>
                        <th className="px-8 py-5 text-left text-[10px] font-bold text-slate-300 uppercase tracking-widest">Due Day</th>
                        <th className="px-8 py-5 text-left text-[10px] font-bold text-slate-300 uppercase tracking-widest">Agent</th>
                        <th className="px-8 py-5 text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">Status</th>
                        <th className="px-8 py-5 text-right text-[10px] font-bold text-slate-300 uppercase tracking-widest">Action</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {filtered.length === 0 ? (
                        <tr><td colSpan="7"><EmptyState title="No Loans Found" description="No matching loan records." icon={FileText} /></td></tr>
                     ) : filtered.map(l => (
                        <tr key={l.id} className="hover:bg-slate-50/50 transition-all group cursor-pointer" onClick={() => { setViewModal(l); setShowSuccess(false); }}>
                           <td className="px-8 py-5">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm group-hover:rotate-6 transition-all">
                                    <User size={18} className="text-primary" />
                                 </div>
                                 <div>
                                    <p className="text-sm font-bold text-slate-800 group-hover:text-primary transition-colors">{l.user?.name}</p>
                                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">ID #{l.id}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-5">
                              <p className="text-sm font-bold text-slate-900">${l.principalAmount.toLocaleString()}</p>
                              <p className="text-[10px] font-bold text-emerald-500 uppercase">{l.interestRate}% Interest</p>
                           </td>
                           <td className="px-8 py-5">
                              <p className="text-sm font-bold text-primary">${l.monthlyPayment?.toLocaleString() || '—'}</p>
                           </td>
                           <td className="px-8 py-5">
                              <p className="text-sm font-bold text-slate-900">{l.dueDay}{l.dueDay === 1 ? 'st' : l.dueDay === 2 ? 'nd' : l.dueDay === 3 ? 'rd' : 'th'} Day</p>
                              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Each Month</p>
                           </td>
                           <td className="px-8 py-5">
                              <div className="flex items-center gap-2">
                                 <Briefcase size={14} className="text-slate-200" />
                                 <span className="text-xs font-bold text-slate-500 uppercase">{l.agent?.name || 'DIRECT'}</span>
                              </div>
                           </td>
                           <td className="px-8 py-5 text-center"><div className="flex justify-center"><StatusBadge status={l.status} /></div></td>
                           <td className="px-8 py-5 text-right">
                              <Btn size="sm" className="!rounded-xl uppercase tracking-widest text-[9px]">Review</Btn>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         <Modal isOpen={!!viewModal} onClose={() => setViewModal(null)} title="Loan Review & Approval">
            {viewModal && (
               <div className="space-y-8 pb-4">
                  {showSuccess ? (
                     <div className="py-20 flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in duration-500">
                        <div className="w-20 h-20 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-xl animate-bounce">
                           <CheckCircle2 size={40} />
                        </div>
                        <div>
                           <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Loan Terms Set</h3>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 italic">Parameters successfully updated.</p>
                        </div>
                     </div>
                  ) : (
                     <div className="space-y-8">
                        <div className="p-10 bg-slate-50 rounded-3xl border border-slate-100 text-center">
                           <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">Loan Amount Requested</p>
                           <h3 className="text-5xl font-bold text-slate-800 tracking-tight">${viewModal.principalAmount.toLocaleString()}</h3>
                           <div className="flex justify-center gap-6 mt-4">
                              <div className="px-4 py-2 rounded-xl bg-white border border-slate-100 text-[10px] font-bold text-slate-500 uppercase">{viewModal.duration} Months</div>
                              <div className="px-4 py-2 rounded-xl bg-white border border-slate-100 text-[10px] font-bold text-primary uppercase">{viewModal.interestRate}% Interest</div>
                           </div>
                        </div>

                        <div className="space-y-3">
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2"><Banknote size={14} className="text-primary" /> Payout Details</p>
                           <Divider />
                           <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Method</p>
                              <p className="text-sm font-bold text-slate-800 uppercase">{viewModal.disbursementMethod || 'CASH'}</p>
                           </div>
                        </div>

                        {viewModal.status === 'PENDING' && (
                           <div className="space-y-6 pt-2">
                              <div className="grid grid-cols-2 gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Assign Agent</label>
                                    <select value={adminFields.agentId} onChange={e => setAdminFields({...adminFields, agentId: e.target.value})}
                                      className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-[10px] font-bold text-slate-800 uppercase tracking-widest outline-none focus:ring-2 focus:ring-primary/10">
                                       <option value="">NO AGENT (DIRECT)</option>
                                       {DUMMY_AGENTS.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                    </select>
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Interest Rate (%)</label>
                                    <input type="number" value={adminFields.interestRate} onChange={e => setAdminFields({...adminFields, interestRate: e.target.value})} className="premium-input h-11" />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Late Fee (%)</label>
                                    <input type="number" value={adminFields.latePenaltyRate} onChange={e => setAdminFields({...adminFields, latePenaltyRate: e.target.value})} className="premium-input h-11" />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Grace Days</label>
                                    <input type="number" value={adminFields.graceDays} onChange={e => setAdminFields({...adminFields, graceDays: e.target.value})} className="premium-input h-11" />
                                 </div>
                              </div>

                              <div className="flex gap-4">
                                 <Btn variant="outline" onClick={handleReject} disabled={isSubmitting}
                                    className="flex-1 !text-rose-500 !border-rose-100 hover:!bg-rose-50">
                                    Decline Loan
                                 </Btn>
                                 <Btn onClick={handleSetTerms} disabled={isSubmitting} className="flex-[2] shadow-lg">
                                    <FileSignature size={16} className="mr-2" /> Approve & Set Terms
                                 </Btn>
                              </div>
                           </div>
                        )}

                        <div className="flex justify-center">
                           <button onClick={() => setViewModal(null)} className="text-slate-300 text-[10px] font-bold uppercase tracking-widest hover:text-slate-800 transition-colors flex items-center gap-2 group">
                              <X size={14} className="group-hover:rotate-90 transition-transform" /> Close
                           </button>
                        </div>
                     </div>
                  )}
               </div>
            )}
         </Modal>
      </div>
   );
}
