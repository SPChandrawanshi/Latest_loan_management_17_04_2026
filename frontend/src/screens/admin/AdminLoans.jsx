import React, { useState, useMemo } from 'react';
import { 
  Search, 
  History, 
  Activity, 
  Wallet, 
  TrendingUp, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Database, 
  LayoutGrid, 
  ChevronRight,
  Download,
  Percent,
  Calendar,
  Zap
} from 'lucide-react';
import { 
  PageTitle, 
  StatusBadge, 
  Btn, 
  Input, 
  StatCard, 
  ProTable, 
  Modal, 
  FormField,
  Divider
} from '../../components/UI';

const DUMMY_LOANS = [
  { id: 'ARK-7701', user: { name: 'James Wilson' }, principalAmount: 25000, duration: 12, createdAt: '2024-10-14', status: 'pending', interestRate: 10, agentCommission: 5 },
  { id: 'ARK-7702', user: { name: 'Sarah Jenkins' }, principalAmount: 12000, duration: 6, createdAt: '2024-10-13', status: 'active', interestRate: 12, agentCommission: 8 },
  { id: 'ARK-7703', user: { name: 'Michael Chen' }, principalAmount: 55000, duration: 24, createdAt: '2024-10-12', status: 'pending', interestRate: 8, agentCommission: 4 },
  { id: 'ARK-7704', user: { name: 'Emma Thompson' }, principalAmount: 8500, duration: 12, createdAt: '2024-10-11', status: 'late', interestRate: 15, agentCommission: 5 },
  { id: 'ARK-7705', user: { name: 'Robert Davis' }, principalAmount: 15000, duration: 12, createdAt: '2024-10-10', status: 'active', interestRate: 10, agentCommission: 5 },
  { id: 'ARK-7706', user: { name: 'Lisa Ray' }, principalAmount: 3000, duration: 3, createdAt: '2024-10-09', status: 'completed', interestRate: 10, agentCommission: 5 },
];

function formatMoney(value) {
  return `$${Number(value || 0).toLocaleString()}`;
}

export default function AdminLoans() {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [viewModal, setViewModal] = useState(null);
  const [loans, setLoans] = useState(DUMMY_LOANS);
  const [config, setConfig] = useState({
    interestRate: 12,
    lateFeeRate: 15,
    agentCommission: 5,
    initiationFee: 3,
    gracePeriod: 3,
    paymentDay: 1
  });

  const filteredLoans = useMemo(() => {
    return loans.filter((loan) => {
      const keyword = search.toLowerCase();
      const matchesSearch = loan.user.name.toLowerCase().includes(keyword) || loan.id.toLowerCase().includes(keyword);
      if (statusFilter === 'ALL') return matchesSearch;
      if (statusFilter === 'PENDING') return matchesSearch && loan.status === 'pending';
      if (statusFilter === 'ACTIVE') return matchesSearch && loan.status === 'active';
      if (statusFilter === 'LATE') return matchesSearch && loan.status === 'late';
      return matchesSearch;
    });
  }, [search, statusFilter, loans]);

  const stats = [
    { label: 'Total Portfolio', value: loans.length, icon: LayoutGrid, key: 'ALL', color: 'text-slate-600' },
    { label: 'Pending Offers', value: loans.filter(l => l.status === 'pending').length, icon: Zap, key: 'PENDING', color: 'text-amber-500' },
    { label: 'Active Contracts', value: loans.filter(l => l.status === 'active').length, icon: ShieldCheck, key: 'ACTIVE', color: 'text-primary' },
    { label: 'Overdue Alerts', value: loans.filter(l => l.status === 'late').length, icon: AlertCircle, key: 'LATE', color: 'text-rose-500' },
  ];

  const handleOpenManage = (loan) => {
    setViewModal(loan);
    setConfig({
      interestRate: loan.interestRate || 12,
      lateFeeRate: 15,
      agentCommission: loan.agentCommission || 5,
      initiationFee: 3,
      gracePeriod: 3,
      paymentDay: 1
    });
  };

  const handleApprove = () => {
    // Simulate updating the loan status
    setLoans(prev => prev.map(l => l.id === viewModal.id ? {...l, status: 'active', ...config} : l));
    setViewModal(null);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <PageTitle 
        title="Loan Registry" 
        subtitle="Review loan requests and configure individual contract terms" 
        action={
          <div className="flex items-center gap-3">
             <Btn variant="outline" size="md">
                <Download size={16} className="mr-2" /> Export CSV
             </Btn>
             <Btn size="md">
                <History size={16} className="mr-2" /> System Logs
             </Btn>
          </div>
        }
      />

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <button
            key={s.key}
            onClick={() => setStatusFilter(s.key)}
            className={`pro-card p-6 text-left transition-all duration-300 border bg-white ${
              statusFilter === s.key ? 'border-primary ring-4 ring-primary/5 shadow-lg' : 'border-slate-100 hover:border-slate-200 shadow-sm'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${statusFilter === s.key ? 'bg-primary text-white' : 'bg-slate-50 text-slate-400'}`}>
               <s.icon size={18} />
            </div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{s.value}</p>
          </button>
        ))}
      </section>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
          <div className="space-y-1">
             <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Contract Flow</h3>
             <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Institutional credit pipeline records</p>
          </div>
          <div className="w-full md:w-80 relative group">
             <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={16} />
             <input 
                className="premium-input pl-12 h-12"
                placeholder="Search by name or reference..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
             />
          </div>
        </div>

        <ProTable headers={[
          { label: 'Borrower Identity' },
          { label: 'Capital Amount' },
          { label: 'Duration' },
          { label: 'Protocol Status' },
          { label: 'Action', className: 'text-right' }
        ]}>
           {filteredLoans.map((loan) => (
             <tr key={loan.id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-5">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-bold border border-slate-50">
                         {loan.user.name[0]}
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-slate-800 transition-colors group-hover:text-primary">{loan.user.name}</p>
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-0.5">#{loan.id}</p>
                      </div>
                   </div>
                </td>
                <td className="px-6 py-5">
                   <p className="text-[13px] font-bold text-slate-900">{formatMoney(loan.principalAmount)}</p>
                </td>
                <td className="px-6 py-5">
                   <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{loan.duration} Months</p>
                </td>
                <td className="px-6 py-5">
                   <StatusBadge status={loan.status} />
                </td>
                <td className="px-6 py-5 text-right">
                   <Btn size="sm" variant={loan.status === 'pending' ? 'primary' : 'outline'} onClick={() => handleOpenManage(loan)}>
                      {loan.status === 'pending' ? 'Make Offer' : 'Details'}
                   </Btn>
                </td>
             </tr>
           ))}
        </ProTable>
      </div>

      <Modal isOpen={!!viewModal} onClose={() => setViewModal(null)} title="Loan Configuration">
        {viewModal && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="p-8 bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto mb-4 text-slate-900 font-extrabold text-xl border border-slate-100">
                 {viewModal.user.name[0]}
              </div>
              <h4 className="text-2xl font-extrabold text-slate-900 tracking-tight">{viewModal.user.name}</h4>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Requested: {formatMoney(viewModal.principalAmount)}</p>
            </div>

            {viewModal.status === 'pending' ? (
              <div className="space-y-6">
                <div className="px-1">
                   <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                     <Percent size={14} className="text-primary" /> Calibrate Contract Terms
                   </h5>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Interest Rate (%)">
                    <Input type="number" value={config.interestRate} onChange={e => setConfig({...config, interestRate: e.target.value})} suffix="%" />
                  </FormField>
                  <FormField label="Late Fee Rate (%)">
                    <Input type="number" value={config.lateFeeRate} onChange={e => setConfig({...config, lateFeeRate: e.target.value})} suffix="%" />
                  </FormField>
                  <FormField label="Agent Commission (%)">
                     <select
                       value={config.agentCommission}
                       onChange={e => setConfig({...config, agentCommission: e.target.value})}
                       className="premium-input h-12 appearance-none text-[11px] font-bold uppercase tracking-widest"
                     >
                        <option value="3">3% Basic</option>
                        <option value="5">5% Standard</option>
                        <option value="8">8% Premium</option>
                        <option value="10">10% Expert</option>
                     </select>
                  </FormField>
                  <FormField label="Initiation Fee (%)">
                    <Input type="number" value={config.initiationFee} onChange={e => setConfig({...config, initiationFee: e.target.value})} suffix="%" />
                  </FormField>
                  <FormField label="Grace Days">
                    <Input type="number" value={config.gracePeriod} onChange={e => setConfig({...config, gracePeriod: e.target.value})} placeholder="e.g. 3" />
                  </FormField>
                  <FormField label="Monthly Payment Day">
                    <Input type="number" value={config.paymentDay} onChange={e => setConfig({...config, paymentDay: e.target.value})} placeholder="1-28" />
                  </FormField>
                </div>

                <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
                   <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center shrink-0">
                         <Zap size={16} />
                      </div>
                      <div>
                         <p className="text-xs font-bold text-slate-900 leading-none">Smart Calculation</p>
                         <p className="text-[10px] font-medium text-slate-500 mt-2 leading-relaxed italic">
                           Based on these terms, the borrower will pay {formatMoney((viewModal.principalAmount * (1 + config.interestRate/100)) / viewModal.duration)} per month.
                         </p>
                      </div>
                   </div>
                </div>

                <div className="flex gap-4 pt-2">
                  <Btn variant="outline" className="flex-1 h-14 border-rose-100 text-rose-500 font-bold hover:bg-rose-50" onClick={() => setViewModal(null)}>Reject Application</Btn>
                  <Btn className="flex-[1.5] h-14" onClick={handleApprove}>Approve & Issue Offer</Btn>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current Status</p>
                      <StatusBadge status={viewModal.status} />
                   </div>
                   <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Interest Set</p>
                      <p className="text-sm font-bold text-slate-900">{viewModal.interestRate}% Monthly</p>
                   </div>
                </div>
                <Btn variant="outline" className="w-full h-14" onClick={() => setViewModal(null)}>Close Database Entry</Btn>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

