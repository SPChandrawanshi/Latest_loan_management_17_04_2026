import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  CreditCard, 
  Wallet, 
  ShieldCheck,
  Clock,
  Plus,
  ArrowUpRight,
  TrendingUp,
  FileText,
  ChevronRight,
  Activity,
  ArrowDownCircle,
  Award,
  Zap
} from 'lucide-react';
import { StatusBadge, StatCard, PageTitle, Btn, EmptyState } from '../../components/UI';

function formatMoney(value) {
  return `$${Number(value || 0).toLocaleString()}`;
}

const DUMMY_ACTIVE_LOAN = {
  id: 'ARK-99281',
  principalAmount: 45000,
  status: 'active',
  dueDate: '2024-11-15',
  interestRate: 8,
  duration: 12
};

export default function BorrowerDashboard() {
  const navigate = useNavigate();

  const stats = [
    { label: 'Available Credit', value: '$25,000', color: '#4f46e5', icon: Wallet },
    { label: 'Next Payment', value: '$1,200', color: '#10b981', icon: Clock },
    { label: 'Total Repaid', value: '$8,400', color: '#6366f1', icon: Award },
    { label: 'Credit Score', value: '782', color: '#0ea5e9', icon: Activity },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* ── SIMPLE WELCOME & ACTIONS ── */}
      <section className="pro-card !p-8 bg-white border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl font-black text-slate-900 tracking-tight text-center md:text-left">Welcome Back</h1>
           <p className="text-sm text-slate-500 font-medium mt-1 text-center md:text-left">Your account is active and all payments are up to date.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
           <Btn onClick={() => navigate('/borrower/apply')} className="flex-1 md:flex-none !h-12 !rounded-xl !px-8">
              Apply for Loan
           </Btn>
           <Btn variant="outline" onClick={() => navigate('/borrower/payments')} className="flex-1 md:flex-none !h-12 !rounded-xl !px-8 !bg-slate-50">
              Pay Now
           </Btn>
        </div>
      </section>

      {/* ── KEY NUMBERS (Simple Stat Boxes) ── */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Available Balance', value: '$25,000', icon: Wallet, color: '#0a3d62' },
          { label: 'Upcoming Payment', value: '$1,200', icon: Clock, color: '#f59e0b' },
          { label: 'Total Repaid', value: '$8,400', icon: Award, color: '#10b981' },
          { label: 'Account Status', value: 'Healthy', icon: Activity, color: '#64748b' },
        ].map((s, i) => (
          <div key={i} className="pro-card hover:border-primary/20 transition-all p-6">
             <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{s.label}</p>
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                   <s.icon size={16} />
                </div>
             </div>
             <p className="text-2xl font-black text-slate-900 leading-none">{s.value}</p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ── MY LOAN SUMMARY ── */}
        <div className="lg:col-span-8 space-y-6">
          <div className="pro-card">
             <div className="flex items-center justify-between mb-8 border-b border-slate-50 pb-4">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Active Loan Summary</h3>
                <StatusBadge status={DUMMY_ACTIVE_LOAN.status} />
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Total Loan Amount</p>
                    <h4 className="text-4xl font-black text-slate-900 tracking-tight">{formatMoney(DUMMY_ACTIVE_LOAN.principalAmount)}</h4>
                </div>
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Due Date</p>
                      <p className="text-sm font-bold text-slate-900">15 Nov 2024</p>
                   </div>
                   <div className="space-y-1 text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Interest</p>
                      <p className="text-sm font-bold text-emerald-600">{DUMMY_ACTIVE_LOAN.interestRate}% Monthly</p>
                   </div>
                </div>
             </div>

              <div className="mt-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
                 <div className="flex items-center gap-4 text-left">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#0a3d62] shadow-sm"><Activity size={20} /></div>
                    <p className="text-xs font-bold text-slate-600 leading-tight">You have completed 40% of this loan repayment cycle. Keep it up!</p>
                 </div>
                 <button 
                   onClick={() => navigate('/borrower/payments')} 
                   className="w-full md:w-auto h-12 px-8 bg-[#0a3d62] rounded-xl hover:bg-[#072a44] transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-2"
                   style={{ color: '#ffffff' }}
                 >
                    <span className="text-xs font-black uppercase tracking-widest">View Full Statement</span>
                    <ChevronRight size={16} />
                 </button>
              </div>
          </div>
        </div>

        {/* ── QUICK ACCESS ── */}
        <div className="lg:col-span-4 space-y-6">
           <div className="pro-card space-y-4">
              <h4 className="stat-label border-b border-slate-50 pb-4">Account Access</h4>
              <div className="space-y-2">
                 {[
                   { label: 'My Documents', sub: 'ID & Verification', icon: FileText, to: '/borrower/collateral' },
                   { label: 'Repayment Ledger', sub: 'Past payments', icon: CreditCard, to: '/borrower/payments' },
                   { label: 'Profile Security', sub: 'Password & KYC', icon: ShieldCheck, to: '/borrower/profile' },
                 ].map((link, i) => (
                   <button key={i} onClick={() => navigate(link.to)} className="w-full p-4 hover:bg-slate-50 rounded-xl flex items-center justify-between transition-all group border border-transparent hover:border-slate-100">
                      <div className="flex items-center gap-4">
                         <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors border border-slate-100 shadow-sm"><link.icon size={16} /></div>
                         <div className="text-left">
                            <p className="text-sm font-bold text-slate-700 leading-none mb-1">{link.label}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{link.sub}</p>
                         </div>
                      </div>
                      <ChevronRight size={14} className="text-slate-300" />
                   </button>
                 ))}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
