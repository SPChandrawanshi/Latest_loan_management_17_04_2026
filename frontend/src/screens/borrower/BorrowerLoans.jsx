import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, Wallet, Clock, Plus, ArrowRight, FileText, CheckCircle2, 
  DollarSign, ChevronRight, ShieldCheck, RotateCcw, Scale, Activity, Calendar
} from 'lucide-react';
import { PageTitle, StatusBadge, StatCard, Btn, ProTable, Modal, Divider } from '../../components/UI';

const DUMMY_LOANS = [
  { id: 'LN-8801', principalAmount: 5000, duration: 12, status: 'APPROVED', interestRate: 10, method: 'BANK_TRANSFER', dueDate: 'Nov 05, 2024', createdAt: '2024-10-01' },
  { id: 'LN-8802', principalAmount: 8500, duration: 6, status: 'PENDING', interestRate: 10, method: 'CASH', dueDate: 'Pending', createdAt: '2024-10-08' },
  { id: 'LN-8803', principalAmount: 3200, duration: 9, status: 'terms_set', interestRate: 12, method: 'CASH', dueDate: 'Nov 15, 2024', createdAt: '2024-10-03' },
];

function formatMoney(value) {
  return `$${Number(value || 0).toLocaleString()}`;
}

export default function BorrowerLoans() {
  const navigate = useNavigate();
  const [loans, setLoans] = useState(DUMMY_LOANS);
  const [viewModal, setViewModal] = useState(null);
  const [acceptTermsModal, setAcceptTermsModal] = useState(null);
  const [isAccepting, setIsAccepting] = useState(false);

  const totalOutstanding = useMemo(() => {
    return loans.reduce((sum, l) => sum + (l.status === 'APPROVED' ? Number(l.principalAmount || 0) : 0), 0);
  }, [loans]);

  const columns = [
    {
      header: 'Reference & Date',
      render: (loan) => (
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm group-hover:bg-slate-900 group-hover:text-white transition-all">
             <FileText size={18} />
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-bold text-slate-900 uppercase tracking-tight group-hover:text-primary transition-colors">ID: {loan.id}</span>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{loan.createdAt}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Loan Amount',
      render: (loan) => (
        <div className="flex flex-col space-y-1">
          <span className="text-sm font-bold text-slate-900">{formatMoney(loan.principalAmount)}</span>
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{loan.duration} Month Term</span>
        </div>
      )
    },
    {
      header: 'Status',
      align: 'center',
      render: (loan) => <StatusBadge status={loan.status} />
    },
    {
      header: 'Actions',
      align: 'right',
      render: (loan) => (
        <Btn 
          variant="outline" 
          size="sm" 
          className="!h-10 !rounded-xl"
          onClick={(e) => {
            e.stopPropagation();
            if (loan.status === 'terms_set') setAcceptTermsModal(loan);
            else setViewModal(loan);
          }}
        >
          {loan.status === 'terms_set' ? 'Review Terms' : 'Details'}
        </Btn>
      )
    }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <PageTitle 
        title="My Loans" 
        subtitle="Manage your loan history and track your repayment status in real-time."
        action={
          <Btn onClick={() => navigate('/borrower/apply')}>
            <Plus size={16} className="mr-2" /> Apply for Loan
          </Btn>
        }
      />

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Total Loans" value={loans.length} icon={FileText} color="text-slate-900" />
        <StatCard label="Active Balance" value={formatMoney(totalOutstanding)} icon={Wallet} color="text-primary" />
        <StatCard label="Next Payment Due" value="Oct 25, 2024" icon={Clock} color="text-amber-500" />
      </section>

      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
           <div>
              <h3 className="text-xl font-bold text-slate-800 tracking-tight">Loan History</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Complete record of your loan applications</p>
           </div>
        </div>
        <ProTable columns={columns} data={loans} onRowClick={(row) => row.status === 'terms_set' ? setAcceptTermsModal(row) : setViewModal(row)} />
      </div>

      <Modal isOpen={!!viewModal} onClose={() => setViewModal(null)} title="Loan Details">
         {viewModal && (
           <div className="space-y-8">
              <div className="p-12 bg-slate-50 border border-slate-100 text-center rounded-3xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Loan Amount</p>
                 <h4 className="text-5xl font-bold text-slate-800 tracking-tight">{formatMoney(viewModal.principalAmount)}</h4>
                 <div className="mt-5 flex justify-center"><StatusBadge status={viewModal.status} /></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 {[
                   { label: 'Total Term', value: `${viewModal.duration} Months`, icon: Clock },
                   { label: 'Interest Rate', value: `${viewModal.interestRate}% Monthly`, icon: Activity },
                   { label: 'Transfer Method', value: viewModal.method?.toUpperCase() || 'Bank', icon: CreditCard },
                   { label: 'Next Payment Due', value: viewModal.dueDate || 'Processing', icon: Calendar }
                 ].map((d, i) => (
                   <div key={i} className="bg-white border border-slate-100 p-6 rounded-2xl space-y-2">
                      <div className="flex items-center gap-2">
                         <d.icon size={12} className="text-primary" />
                         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{d.label}</p>
                      </div>
                      <p className="text-sm font-bold text-slate-800">{d.value}</p>
                   </div>
                 ))}
              </div>

              <Btn onClick={() => setViewModal(null)} className="w-full h-12 shadow-lg">Close Information</Btn>
           </div>
         )}
      </Modal>

      <Modal isOpen={!!acceptTermsModal} onClose={() => setAcceptTermsModal(null)} title="Loan Confirmation">
         {acceptTermsModal && (
           <div className="space-y-8">
              <div className="space-y-3">
                 <h3 className="text-xl font-bold text-slate-800 tracking-tight">Review Agreement Terms</h3>
                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest italic leading-relaxed">Please review the finalized loan parameters before accepting the agreement.</p>
              </div>

              <div className="p-10 bg-slate-900 text-white rounded-3xl relative overflow-hidden shadow-xl">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                 <div className="flex justify-between items-center relative z-10">
                    <div className="space-y-2">
                       <span className="text-[10px] font-bold opacity-50 uppercase tracking-widest">Approved Amount</span>
                       <h4 className="text-4xl font-bold">{formatMoney(acceptTermsModal.principalAmount)}</h4>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
                       <Scale size={28} className="text-primary" />
                    </div>
                 </div>
                 <Divider className="opacity-10 mt-8 mb-6" />
                 <div className="grid grid-cols-2 gap-8 relative z-10">
                    <div>
                       <p className="text-[9px] font-bold opacity-50 uppercase tracking-widest">Monthly Interest</p>
                       <p className="text-lg font-bold mt-1">{acceptTermsModal.interestRate}%</p>
                    </div>
                    <div>
                       <p className="text-[9px] font-bold opacity-50 uppercase tracking-widest">Full Term</p>
                       <p className="text-lg font-bold mt-1">{acceptTermsModal.duration} Months</p>
                    </div>
                 </div>
              </div>

              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 text-[10px] font-bold text-slate-400 italic leading-relaxed">
                 By clicking 'Sign & Accept', you confirm you have read and understood the terms of this financial agreement. You commit to the repayment schedule as defined in the loan details.
              </div>

              <div className="flex gap-4">
                 <Btn variant="outline" onClick={() => setAcceptTermsModal(null)} className="flex-1 h-12">Decline</Btn>
                 <Btn 
                   onClick={() => {
                     setIsAccepting(true);
                     setTimeout(() => {
                       setLoans(prev => prev.map(l => l.id === acceptTermsModal.id ? { ...l, status: 'APPROVED' } : l));
                       setIsAccepting(false);
                       setAcceptTermsModal(null);
                     }, 800);
                   }}
                   disabled={isAccepting}
                   className="flex-[2] h-12 shadow-lg"
                 >
                   {isAccepting ? 'Processing...' : 'Sign & Accept'}
                 </Btn>
              </div>
           </div>
         )}
      </Modal>
    </div>
  );
}
