import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, Clock, Search, DollarSign, ArrowRight, Activity,
  TrendingUp, Receipt, RotateCcw, ShieldCheck, X
} from 'lucide-react';
import { PageTitle, StatCard, ProTable, Modal, Btn, StatusBadge } from '../../components/UI';

const DUMMY_PAYMENTS = [
  { id: 1, loanId: 'LN-8801', trxId: 'TXN-88271', totalCollected: 1200, method: 'Bank Transfer', status: 'verified', createdAt: '2024-10-14' },
  { id: 2, loanId: 'LN-8801', trxId: 'TXN-88272', totalCollected: 1200, method: 'Mobile Money', status: 'pending', createdAt: '2024-10-15' },
  { id: 3, loanId: 'LN-8802', trxId: 'TXN-88273', totalCollected: 850, method: 'Bank Wire', status: 'verified', createdAt: '2024-10-12' },
];

function formatMoney(value) {
  return `$${Number(value || 0).toLocaleString()}`;
}

export default function BorrowerPayments() {
  const [payments] = useState(DUMMY_PAYMENTS);
  const [search, setSearch] = useState('');
  const [viewModal, setViewModal] = useState(null);

  const filtered = useMemo(
    () => payments.filter((p) => {
      const term = search.toLowerCase();
      return String(p.loanId).toLowerCase().includes(term) || String(p.trxId || '').toLowerCase().includes(term);
    }),
    [payments, search]
  );

  const stats = useMemo(() => [
    { label: 'Total Paid', value: formatMoney(payments.filter(p => p.status === 'verified').reduce((s, p) => s + (p.totalCollected || 0), 0)), icon: CheckCircle2, color: 'text-emerald-500' },
    { label: 'Pending Verification', value: payments.filter(p => p.status === 'pending').length, icon: Clock, color: 'text-amber-500' },
    { label: 'Total Transactions', value: payments.length, icon: Receipt, color: 'text-slate-900' },
  ], [payments]);

  const columns = [
    {
      header: 'Payment Reference',
      render: (p) => (
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm group-hover:bg-slate-900 group-hover:text-white transition-all">
             <Receipt size={18} />
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-bold text-slate-900 uppercase group-hover:text-primary transition-colors">Loan #{p.loanId}</span>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{p.createdAt}</span>
          </div>
        </div>
      )
    },
    {
      header: 'External ID',
      render: (p) => (
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 py-2 bg-slate-50 rounded-lg">
          {p.trxId || 'Processing'}
        </span>
      )
    },
    {
      header: 'Amount',
      render: (p) => (
        <div className="flex flex-col space-y-1">
          <span className="text-sm font-bold text-slate-900">{formatMoney(p.totalCollected)}</span>
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">via {p.method}</span>
        </div>
      )
    },
    {
      header: 'Status',
      align: 'center',
      render: (p) => <StatusBadge status={p.status} />
    },
    {
      header: 'Receipt',
      align: 'right',
      render: (p) => (
        <Btn variant="outline" size="sm" className="!h-10 !rounded-xl" onClick={(e) => {
          e.stopPropagation();
          setViewModal(p);
        }}>View</Btn>
      )
    }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <PageTitle 
        title="Payment History" 
        subtitle="Track all your past payments and view historical transaction receipts." 
      />

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <StatCard key={i} label={s.label} value={s.value} icon={s.icon} color={s.color} />
        ))}
      </section>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
           <div>
              <h3 className="text-xl font-bold text-slate-800 tracking-tight">Transaction History</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Official record of all financial contributions</p>
           </div>
           <div className="relative w-full md:w-80 group">
             <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
             <input
               className="premium-input pl-12 h-11"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               placeholder="Search reference or loan..."
             />
           </div>
        </div>

        <ProTable columns={columns} data={filtered} onRowClick={setViewModal} />
      </div>

      <Modal isOpen={!!viewModal} onClose={() => setViewModal(null)} title="Payment Receipt">
         {viewModal && (
           <div className="space-y-8">
              <div className="p-12 bg-slate-50 border border-slate-100 text-center rounded-3xl relative overflow-hidden">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Payment Amount</p>
                 <h4 className="text-5xl font-bold text-slate-800 tracking-tight">{formatMoney(viewModal.totalCollected)}</h4>
                 <div className="mt-5 flex justify-center"><StatusBadge status={viewModal.status} /></div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                 {[
                   { label: 'Reference ID', value: viewModal.trxId || 'N/A' },
                   { label: 'Payment Method', value: viewModal.method?.toUpperCase() || 'Bank' },
                   { label: 'Loan ID', value: `#${viewModal.loanId}` },
                   { label: 'Date', value: viewModal.createdAt }
                 ].map((d, i) => (
                    <div key={i} className="flex justify-between items-center py-4 border-b border-slate-50 last:border-none">
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{d.label}</span>
                       <span className="text-sm font-bold text-slate-800 uppercase">{d.value}</span>
                    </div>
                 ))}
              </div>

              <Btn onClick={() => setViewModal(null)} className="w-full h-12 shadow-lg">Close Receipt</Btn>
           </div>
         )}
      </Modal>
    </div>
  );
}
