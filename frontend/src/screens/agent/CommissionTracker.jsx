import React, { useState, useRef } from 'react';
import { 
  DollarSign, TrendingUp, Clock, ArrowUpRight, CheckCircle2, 
  Wallet, Activity, ShieldCheck, ChevronRight
} from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PageTitle, StatusBadge, StatCard, Btn, ProTable, Modal, Divider, FormField } from '../../components/UI';

const DUMMY_USER = { name: 'Victor Banda', role: 'agent' };

const DUMMY_COMMISSIONS = [
  { id: 1, agent: { name: 'Victor Banda' }, borrower: { name: 'Michael Johnson' }, amount: 250, percentage: 5, status: 'PAID', createdAt: '2024-10-01T00:00:00Z' },
  { id: 2, agent: { name: 'Victor Banda' }, borrower: { name: 'Sarah Williams' }, amount: 425, percentage: 5, status: 'PENDING', createdAt: '2024-10-08T00:00:00Z' },
  { id: 3, agent: { name: 'Victor Banda' }, borrower: { name: 'James Wilson' }, amount: 125, percentage: 5, status: 'PENDING', createdAt: '2024-10-14T00:00:00Z' },
  { id: 4, agent: { name: 'Victor Banda' }, borrower: { name: 'Emma Thompson' }, amount: 600, percentage: 5, status: 'PAID', createdAt: '2024-09-15T00:00:00Z' },
];

const DUMMY_PAYOUTS = [
  { id: 1, agent: { name: 'Victor Banda' }, amount: 850, method: 'BANK_TRANSFER', status: 'COMPLETED', createdAt: '2024-09-20T00:00:00Z' },
  { id: 2, agent: { name: 'Victor Banda' }, amount: 550, method: 'MOBILE_MONEY', status: 'PENDING', createdAt: '2024-10-10T00:00:00Z' },
];

export default function CommissionTracker() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const historySectionRef = useRef(null);
  const [history] = useState(DUMMY_COMMISSIONS);
  const [payouts, setPayouts] = useState(DUMMY_PAYOUTS);
  const [filterStatus, setFilterStatus] = useState('all');
  const [payoutFilter, setPayoutFilter] = useState('all');
  const [selectedTx, setSelectedTx] = useState(null);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isManagement = false; // pure agent view for UI demo

  const stats = {
    total: history.reduce((sum, c) => sum + Number(c.amount), 0),
    count: history.length,
  };
  const pendingEarnings = history.filter(c => c.status === 'PENDING').reduce((sum, c) => sum + Number(c.amount), 0);

  const handlePayoutRequest = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setPayouts(prev => [...prev, { id: Date.now(), agent: { name: DUMMY_USER.name }, amount: pendingEarnings, method: 'NETWORK', status: 'PENDING', createdAt: new Date().toISOString() }]);
      setIsSubmitting(false);
      setIsPayoutModalOpen(false);
    }, 1000);
  };

  const historyColumns = [
    { header: 'Node / ID', render: (c) => (<div><span className="text-sm font-bold text-slate-900 uppercase">#{c.id}</span><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mt-1">{new Date(c.createdAt).toLocaleDateString()}</span></div>) },
    { header: 'Borrower', render: (c) => <span className="text-sm font-bold text-slate-800 uppercase">{c.borrower?.name}</span> },
    { header: 'Yield', align: 'right', render: (c) => (<div className="text-right"><span className="text-sm font-bold text-slate-900">${Number(c.amount).toLocaleString()}</span><span className="text-[9px] font-bold text-emerald-500 uppercase block mt-1">{c.percentage}% Ratio</span></div>) },
    { header: 'Status', align: 'center', render: (c) => <StatusBadge status={c.status === 'PAID' ? 'verified' : 'pending'} /> },
  ];

  const payoutColumns = [
    { header: 'Settlement / Date', render: (p) => (<div><span className="text-sm font-bold text-slate-900 uppercase">#{p.id}</span><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mt-1">{new Date(p.createdAt).toLocaleDateString()}</span></div>) },
    { header: 'Amount / Method', align: 'right', render: (p) => (<div className="text-right"><span className="text-base font-bold text-slate-900">${Number(p.amount).toLocaleString()}</span><span className="text-[9px] font-bold text-slate-400 uppercase block mt-1">{p.method}</span></div>) },
    { header: 'Verification', align: 'center', render: (p) => <StatusBadge status={p.status === 'COMPLETED' ? 'verified' : 'pending'} /> },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <PageTitle 
        title="Yield Intelligence" 
        subtitle="Comprehensive performance analytics and yield tracking for your referral network."
        action={
          pendingEarnings > 0 && (
            <Btn onClick={() => setIsPayoutModalOpen(true)} className="shadow-lg shadow-primary/20">
              <Wallet size={16} className="mr-2" /> Request Settlement
            </Btn>
          )
        }
      />

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Aggregate Yield" value={`$${stats.total.toLocaleString()}`} icon={DollarSign} color="text-primary" />
        <StatCard label="Pending Liquidity" value={`$${pendingEarnings.toLocaleString()}`} icon={Clock} color="text-amber-500" />
        <StatCard label="Registry Entries" value={stats.count} icon={Activity} color="text-emerald-500" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div ref={historySectionRef} className="space-y-5 scroll-mt-24">
           <div className="flex items-center justify-between px-1">
              <div>
                <h3 className="text-lg font-bold text-slate-800 tracking-tight">Yield Ledger</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Inbound commission stream audit</p>
              </div>
              <div className="flex gap-2">
                 {['all', 'pending', 'paid'].map(k => (
                    <button key={k} onClick={() => setFilterStatus(k)}
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${filterStatus === k ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-100 text-slate-400 hover:text-slate-600'}`}
                    >{k}</button>
                 ))}
              </div>
           </div>
           <ProTable 
              columns={historyColumns} 
              data={history.filter(c => filterStatus === 'all' ? true : filterStatus === 'paid' ? c.status === 'PAID' : c.status !== 'PAID')} 
              onRowClick={(row) => setSelectedTx(row)}
           />
        </div>

        <div className="space-y-5">
           <div className="flex items-center justify-between px-1">
              <div>
                <h3 className="text-lg font-bold text-slate-800 tracking-tight">Settlement Archive</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Outbound fund flow records</p>
              </div>
              <div className="flex gap-2">
                 {['all', 'PENDING', 'COMPLETED'].map(k => (
                    <button key={k} onClick={() => setPayoutFilter(k)}
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${payoutFilter === k ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-100 text-slate-400 hover:text-slate-600'}`}
                    >{k === 'COMPLETED' ? 'Verified' : k}</button>
                 ))}
              </div>
           </div>
           <ProTable 
              columns={payoutColumns} 
              data={payouts.filter(p => payoutFilter === 'all' ? true : p.status === payoutFilter)} 
           />
        </div>
      </div>

      <Modal isOpen={!!selectedTx} onClose={() => setSelectedTx(null)} title="Yield Node Disclosure">
         {selectedTx && (
           <div className="space-y-8">
              <div className="bg-slate-900 p-10 rounded-3xl relative overflow-hidden text-white text-center">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] -translate-y-1/2 translate-x-1/2" />
                 <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6 mx-auto">
                    <DollarSign size={28} />
                 </div>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Audited Node Yield</p>
                 <h3 className="text-4xl font-bold tracking-tight">${Number(selectedTx.amount).toLocaleString()}</h3>
              </div>

              <div className="grid grid-cols-1 gap-3">
                 {[
                   { label: 'Target Entity', value: selectedTx.borrower?.name || 'BORROWER_NODE' },
                   { label: 'Yield Ratio', value: `${selectedTx.percentage}% Allocation` },
                   { label: 'Value Date', value: new Date(selectedTx.createdAt).toLocaleString() },
                   { label: 'Registry Status', value: selectedTx.status === 'PAID' ? 'CLEARED' : 'PENDING' },
                 ].map((row, i) => (
                    <div key={i} className="flex justify-between items-center p-5 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:shadow-lg transition-all">
                       <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{row.label}</span>
                       <span className={`text-sm font-bold uppercase tracking-tight ${row.label === 'Registry Status' ? (selectedTx.status === 'PAID' ? 'text-emerald-500' : 'text-amber-500') : 'text-slate-800'}`}>{row.value}</span>
                    </div>
                 ))}
              </div>

              <Btn variant="outline" onClick={() => setSelectedTx(null)} className="w-full h-12 uppercase tracking-widest text-[10px]">Close Disclosure</Btn>
           </div>
         )}
      </Modal>

      <Modal isOpen={isPayoutModalOpen} onClose={() => setIsPayoutModalOpen(false)} title="Settlement Protocol">
         <div className="space-y-8">
            <div className={`p-10 rounded-3xl relative overflow-hidden shadow-xl text-white text-center ${pendingEarnings > 0 ? 'bg-primary' : 'bg-slate-900'}`}>
               <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 blur-[60px] translate-x-1/2 -translate-y-1/2" />
               <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-3">Liquid Pipeline Value</p>
               <p className="text-5xl font-bold tracking-tight">${pendingEarnings.toLocaleString()}</p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex gap-4">
               <ShieldCheck size={24} className="text-primary flex-shrink-0" />
               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed italic">
                 Settlement cycles initiate on the 1st of each month. Manual requests are prioritized within 24 business hours.
               </p>
            </div>

            <Btn onClick={handlePayoutRequest} disabled={pendingEarnings === 0 || isSubmitting}
               className={`w-full h-14 shadow-xl ${pendingEarnings > 0 ? '' : 'grayscale opacity-50 cursor-not-allowed'}`}>
               {isSubmitting ? 'Transmitting...' : (pendingEarnings > 0 ? 'Execute Settlement Request' : 'Insufficient Liquidity')}
            </Btn>
         </div>
      </Modal>
    </div>
  );
}
