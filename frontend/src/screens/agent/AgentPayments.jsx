import React, { useState } from 'react';
import { 
  DollarSign, 
  History, 
  Clock, 
  ArrowUpRight, 
  CreditCard, 
  Wallet, 
  CheckCircle2,
  Calendar, 
  Search, 
  ArrowDownCircle, 
  Zap, 
  Activity,
  Globe,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { PageTitle, StatusBadge, StatCard, Btn, Input, Modal, EmptyState, Divider } from '../../components/UI';

const DUMMY_PAYOUTS = [
  { id: 1, borrower: { name: 'Michael Johnson' }, amount: 250, percentage: 5, status: 'PAID', createdAt: '2024-10-01T00:00:00Z' },
  { id: 2, borrower: { name: 'Sarah Williams' }, amount: 425, percentage: 5, status: 'PAID', createdAt: '2024-10-08T00:00:00Z' },
  { id: 3, borrower: { name: 'Emma Thompson' }, amount: 600, percentage: 5, status: 'PAID', createdAt: '2024-09-15T00:00:00Z' },
  { id: 4, borrower: { name: 'James Wilson' }, amount: 125, percentage: 5, status: 'PAID', createdAt: '2024-10-14T00:00:00Z' },
];

function formatMoney(value) {
  return `K${Number(value || 0).toLocaleString()}`;
}

export default function AgentPayments() {
  const [payouts] = useState(DUMMY_PAYOUTS);
  const [search, setSearch] = useState('');
  const [selectedPayout, setSelectedPayout] = useState(null);

  const filtered = payouts.filter(p =>
    (p.borrower?.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.id || '').toString().includes(search)
  );

  const totalYield = payouts.reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <PageTitle 
        title="Settlement Registry" 
        subtitle="Comprehensive orchestration and auditing of yield disbursements and institutional payouts" 
      />

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Aggregate Yield" value={formatMoney(totalYield)} icon={TrendingUp} color="#2563eb" trend="+12.4%" trendUp={true} />
        <StatCard label="Disbursements" value={payouts.length} icon={Activity} color="#10b981" trend="Active Grid" />
        <StatCard label="Security Status" value="ENCRYPTED" icon={ShieldCheck} color="#f59e0b" trend="Verified" />
      </section>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 relative group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
          <Input 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder="Search settlements by reference or entity node..."
            className="pl-12"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <EmptyState 
            icon={History}
            title="Registry Void"
            description="No settlement events discovered in the current directive."
            action={<span />}
          />
        ) : (
          filtered.map(p => (
            <div
              key={p.id}
              onClick={() => setSelectedPayout(p)}
              className="premium-card bg-white p-6 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex items-center gap-5 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 border-none text-primary flex items-center justify-center shadow-lg group-hover:rotate-12 transition-all">
                  <ArrowDownCircle size={22} />
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-900 group-hover:text-primary transition-colors uppercase tracking-tight leading-none mb-2">TX_REF: #{p.id}</h4>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.borrower?.name || 'ROOT_ENTITY'}</span>
                    <Divider className="!my-0 !h-1 !w-1 rounded-full bg-slate-200" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{new Date(p.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-10 relative z-10 pl-14 md:pl-0">
                <div className="text-right">
                  <p className="text-xl font-black text-slate-900 tracking-tighter leading-none mb-1">{formatMoney(p.amount)}</p>
                  <p className="text-[9px] font-black text-primary uppercase tracking-widest italic">{p.percentage}% Node Yield</p>
                </div>
                <div className="flex items-center gap-4">
                  <StatusBadge status="PAID" />
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white transition-all shadow-inner border border-slate-100">
                    <ArrowUpRight size={18} />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={!!selectedPayout} onClose={() => setSelectedPayout(null)} title="Settlement Disclosure Interface">
        {selectedPayout && (
          <div className="space-y-10">
            <div className="premium-card bg-slate-900 p-10 relative overflow-hidden text-white border-none shadow-2xl text-center">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-[80px] -translate-y-1/2 translate-x-1/2" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-4 animate-pulse">Confirmed Institutional Yield</p>
              <p className="text-5xl font-black tracking-tighter leading-none">{formatMoney(selectedPayout.amount)}</p>
              <div className="mt-8 flex justify-center">
                 <StatusBadge status="PAID" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl group hover:bg-white hover:shadow-xl transition-all">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Ledger Identifier</p>
                  <p className="text-sm font-black text-slate-900 uppercase">#SETTLE_{selectedPayout.id}</p>
               </div>
               <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl group hover:bg-white hover:shadow-xl transition-all">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Affiliated Entity</p>
                  <p className="text-sm font-black text-slate-900 uppercase">{selectedPayout.borrower?.name || 'SYSTEM'}</p>
               </div>
               <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl group hover:bg-white hover:shadow-xl transition-all">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Yield Calibration</p>
                  <p className="text-sm font-black text-primary uppercase">{selectedPayout.percentage}% Allocation</p>
               </div>
               <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl group hover:bg-white hover:shadow-xl transition-all">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Temporal Registry</p>
                  <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">{new Date(selectedPayout.createdAt).toLocaleString()}</p>
               </div>
            </div>

            <Btn variant="outline" onClick={() => setSelectedPayout(null)} className="w-full !h-14 uppercase tracking-widest text-[10px] font-black !rounded-2xl">
              Dismiss Disclosure
            </Btn>
          </div>
        )}
      </Modal>
    </div>
  );
}
