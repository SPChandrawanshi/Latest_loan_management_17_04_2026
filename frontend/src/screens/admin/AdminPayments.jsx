import React, { useMemo, useState } from 'react';
import { 
  CheckCircle2, Clock3, Receipt, Search, Database, TrendingUp, Activity, History, 
  ShieldAlert, AlertCircle, ChevronRight, Filter, Download, Zap, CreditCard,
  UserCheck
} from 'lucide-react';
import { PageTitle, StatusBadge, StatCard, Btn, Input, ProTable, Modal, Divider } from '../../components/UI';

const DUMMY_PAYMENTS = [
  { id: 'P-9921', loanId: 'ARK-7702', loan: { user: { name: 'Sarah Jenkins' } }, baseAmount: 1200, totalCollected: 1200, trxId: 'TXN-88271', status: 'verified', createdAt: '2024-10-14', method: 'Direct Transfer', penaltyAmount: 0 },
  { id: 'P-9922', loanId: 'ARK-7705', loan: { user: { name: 'Robert Davis' } }, baseAmount: 1500, totalCollected: 1500, trxId: 'TXN-88272', status: 'pending', createdAt: '2024-10-15', method: 'Mobile Money', penaltyAmount: 0 },
  { id: 'P-9923', loanId: 'ARK-7704', loan: { user: { name: 'Emma Thompson' } }, baseAmount: 850, totalCollected: 1050, trxId: 'TXN-88273', status: 'late', createdAt: '2024-10-12', method: 'Card Payment', penaltyAmount: 200 },
  { id: 'P-9924', loanId: 'ARK-7701', loan: { user: { name: 'James Wilson' } }, baseAmount: 2500, totalCollected: 2500, trxId: 'TXN-88274', status: 'verified', createdAt: '2024-10-10', method: 'Bank Wire', penaltyAmount: 0 },
  { id: 'P-9925', loanId: 'ARK-7703', loan: { user: { name: 'Michael Chen' } }, baseAmount: 1100, totalCollected: 1100, trxId: 'TXN-88275', status: 'pending', createdAt: '2024-10-16', method: 'Direct Transfer', penaltyAmount: 0 },
];

function formatMoney(value) {
  return `$${Number(value || 0).toLocaleString()}`;
}

export default function AdminPayments() {
  const [payments, setPayments] = useState(DUMMY_PAYMENTS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewModal, setViewModal] = useState(null);
  const [verifying, setVerifying] = useState(false);

  const stats = useMemo(() => {
    const collected = payments
      .filter((p) => p.status === 'verified')
      .reduce((sum, p) => sum + Number(p.totalCollected), 0);
    const pending = payments.filter((p) => p.status === 'pending').length;
    const late = payments.filter((p) => p.status === 'late').length;
    return { collected, pending, late };
  }, [payments]);

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const term = search.toLowerCase();
      const matchesSearch = p.loan.user.name.toLowerCase().includes(term) || p.trxId.toLowerCase().includes(term);
      const matchesStatus = statusFilter === 'ALL' || p.status.toUpperCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [payments, search, statusFilter]);

  const handleVerify = () => {
    setVerifying(true);
    setTimeout(() => {
      setPayments(prev => prev.map(p => p.id === viewModal.id ? {...p, status: 'verified'} : p));
      setVerifying(false);
      setViewModal(null);
    }, 800);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <PageTitle 
        title="Revenue Ledger" 
        subtitle="Tracking and auditing all institutional loan repayments" 
        action={
          <div className="flex items-center gap-3">
             <Btn variant="outline" size="md">
                <History size={16} className="mr-2" /> Sync Records
             </Btn>
             <Btn size="md">
                <Download size={16} className="mr-2" /> Export Report
             </Btn>
          </div>
        }
      />

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Revenue', value: formatMoney(stats.collected), icon: TrendingUp, color: 'text-emerald-500' },
          { label: 'Pending Audit', value: stats.pending, icon: Clock3, color: 'text-amber-500' },
          { label: 'Delinquent Fees', value: stats.late, icon: ShieldAlert, color: 'text-rose-500' },
        ].map((s, i) => (
           <StatCard key={i} label={s.label} value={s.value} icon={s.icon} color={s.color} />
        ))}
      </section>

      <div className="space-y-6">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 px-1">
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 gap-1">
            {[['ALL','Overview'],['PENDING','Pending'],['VERIFIED','Verified'],['LATE','Late']].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setStatusFilter(val)}
                className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                  statusFilter === val ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'
                }`}>
                {label}
              </button>
            ))}
          </div>

          <div className="relative flex-1 xl:max-w-md w-full group">
             <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={16} />
             <input 
                className="premium-input pl-12 h-12"
                placeholder="Search by name or transaction ID..."
                value={search}
                onChange={e => setSearch(e.target.value)}
             />
          </div>
        </div>

        <ProTable headers={[
          { label: 'Borrower' },
          { label: 'Amount Collected' },
          { label: 'Method' },
          { label: 'Status' },
          { label: 'Action', className: 'text-right' }
        ]}>
          {filteredPayments.map((p) => (
            <tr key={p.id} className="group hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-5">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs">
                       {p.loan.user.name[0]}
                    </div>
                    <div>
                       <p className="text-[13px] font-bold text-slate-800 transition-colors group-hover:text-primary">{p.loan.user.name}</p>
                       <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-0.5">ID: {p.trxId}</p>
                    </div>
                 </div>
              </td>
              <td className="px-6 py-5">
                 <p className="text-[13px] font-bold text-slate-900">{formatMoney(p.totalCollected)}</p>
                 {p.penaltyAmount > 0 && <p className="text-[9px] font-bold text-rose-500 uppercase mt-0.5">Penalty included</p>}
              </td>
              <td className="px-6 py-5">
                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{p.method}</p>
              </td>
              <td className="px-6 py-5">
                 <StatusBadge status={p.status} />
              </td>
              <td className="px-6 py-5 text-right">
                 <Btn size="sm" variant="outline" onClick={() => setViewModal(p)}>Audit Entry</Btn>
              </td>
            </tr>
          ))}
        </ProTable>
      </div>

      <Modal isOpen={!!viewModal} onClose={() => setViewModal(null)} title="Payment Audit">
        {viewModal && (
          <div className="space-y-8">
            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 text-center relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl opacity-50" />
               <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Verified Amount</p>
               <h4 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                  {formatMoney(viewModal.totalCollected)}
               </h4>
               <div className="mt-6 flex justify-center gap-3">
                  <div className="px-4 py-1.5 rounded-xl bg-white border border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                     {viewModal.loan.user.name}
                  </div>
                  <StatusBadge status={viewModal.status} />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               {[
                 { label: 'Recieved via', value: viewModal.method, icon: CreditCard, color: 'text-primary' },
                 { label: 'Penalty Dues', value: formatMoney(viewModal.penaltyAmount), icon: ShieldAlert, color: 'text-rose-500' },
                 { label: 'Contract REF', value: viewModal.loanId, icon: Database, color: 'text-slate-400' },
                 { label: 'Network REF', value: viewModal.trxId, icon: UserCheck, color: 'text-emerald-500' },
               ].map((item, i) => (
                  <div key={i} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-1">
                     <div className="flex items-center gap-2">
                        <item.icon size={12} className={item.color} />
                        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{item.label}</p>
                     </div>
                     <p className="text-xs font-bold text-slate-800">{item.value}</p>
                  </div>
               ))}
            </div>

            <div className="flex flex-col gap-3 pt-2">
               {viewModal.status === 'pending' && (
                 <Btn className="w-full h-14" onClick={handleVerify} loading={verifying}>Verify & Post to Ledger</Btn>
               )}
               <Btn variant="outline" className="w-full h-14" onClick={() => setViewModal(null)}>Close Record</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

