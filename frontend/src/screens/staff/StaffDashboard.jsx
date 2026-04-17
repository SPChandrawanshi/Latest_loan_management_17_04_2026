import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, CheckCircle2, Clock, TrendingUp, ShieldCheck, FileText, CreditCard,
  BarChart3, Users, ArrowRight, User, ChevronRight
} from 'lucide-react';
import { StatusBadge, StatCard, Btn } from '../../components/UI';

const DUMMY_USER = { name: 'Operations Staff', role: 'staff' };

const DUMMY_LOANS = [
  { id: 'LN-8801', user: { name: 'Michael Johnson' }, principalAmount: 5000, duration: 12, status: 'pending' },
  { id: 'LN-8802', user: { name: 'Sarah Williams' }, principalAmount: 8500, duration: 6, status: 'pending' },
  { id: 'LN-8803', user: { name: 'David Brown' }, principalAmount: 3200, duration: 9, status: 'pending' },
];

const METRICS = {
  pendingLoans: 3,
  pendingPayments: 5,
  latePayments: 2,
  collected: 42300,
};

function formatMoney(value) {
  return `$${Number(value || 0).toLocaleString()}`;
}

export default function StaffDashboard() {
  const navigate = useNavigate();
  const user = DUMMY_USER;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      <section className="pro-card p-12 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.03),transparent)]" />
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div className="space-y-5">
             <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl">
                <ShieldCheck size={14} className="text-primary" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">System Status: Active</span>
             </div>
             <div className="space-y-3">
                <h1 className="text-4xl font-bold text-slate-800 tracking-tight">Hello</h1>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed max-w-xl italic">
                  Welcome to the management dashboard. Review new applications and oversee daily financial operations.
                </p>
             </div>
          </div>
          <div className="flex flex-wrap gap-4">
             <Btn onClick={() => navigate('/staff/loans')} size="lg" className="shadow-lg shadow-primary/20">
                View Applications <ArrowRight size={18} className="ml-3" />
             </Btn>
             <Btn variant="outline" size="lg" onClick={() => navigate('/staff/calendar')}>
                <Calendar size={18} className="mr-3" /> Staff Calendar
             </Btn>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Pending Approvals', value: METRICS.pendingLoans, icon: FileText, color: 'text-primary' },
          { label: 'Pending Payments', value: METRICS.pendingPayments, icon: CreditCard, color: 'text-emerald-500' },
          { label: 'Overdue Loans', value: METRICS.latePayments, icon: Clock, color: 'text-amber-500' },
          { label: 'Total Collections', value: formatMoney(METRICS.collected), icon: TrendingUp, color: 'text-slate-900' },
        ].map((s, i) => (
           <StatCard key={i} label={s.label} value={s.value} icon={s.icon} color={s.color} />
        ))}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 pro-card p-10 bg-white border border-slate-100 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-800 tracking-tight">New Applications</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Incoming loan requests awaiting review</p>
            </div>
            <Btn variant="outline" size="sm" onClick={() => navigate('/staff/loans')}>View All</Btn>
          </div>

          <div className="space-y-4">
            {DUMMY_LOANS.map((l) => (
              <div key={l.id} className="group p-6 bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 rounded-2xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                 <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-all">
                       <User size={22} />
                    </div>
                    <div className="space-y-1">
                       <p className="text-sm font-bold text-slate-800 group-hover:text-primary transition-colors">{l.user.name}</p>
                       <div className="flex items-center gap-4">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{formatMoney(l.principalAmount)}</span>
                          <div className="w-1 h-1 rounded-full bg-slate-200" />
                          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{l.duration} Month Period</span>
                       </div>
                    </div>
                 </div>
                 <div className="flex items-center gap-5">
                    <StatusBadge status={l.status} />
                    <button onClick={() => navigate('/staff/loans')} className="w-10 h-10 rounded-xl border border-slate-100 bg-white flex items-center justify-center text-slate-300 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                       <ChevronRight size={18} />
                    </button>
                 </div>
              </div>
            ))}
          </div>
        </div>

        <div className="xl:col-span-4 pro-card p-10 bg-white border border-slate-100 shadow-sm space-y-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blur-3xl translate-x-1/2 -translate-y-1/2" />
           <div className="relative z-10 space-y-1 px-1">
              <h3 className="text-xl font-bold text-slate-800 tracking-tight">Quick Actions</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Management Shortcuts</p>
           </div>

           <div className="relative z-10 space-y-3">
              {[
                { label: 'Loan Reviews', sub: 'Assess new applications', icon: FileText, to: '/staff/loans' },
                { label: 'Payment Verification', sub: 'Verify customer payments', icon: CreditCard, to: '/staff/payments' },
                { label: 'Customer Directory', sub: 'Search borrower records', icon: Users, to: '/staff/borrowers' },
                { label: 'System Reports', sub: 'Operational analytics', icon: BarChart3, to: '/staff/dashboard' }
              ].map((a, i) => (
                <button 
                  key={i} 
                  onClick={() => navigate(a.to)}
                  className="w-full p-6 bg-slate-50 hover:bg-white rounded-2xl border-2 border-slate-50 professional-hover text-left group"
                >
                   <div className="flex items-center justify-between">
                      <div className="space-y-1">
                         <p className="text-sm font-bold text-slate-800 group-hover:text-primary transition-colors">{a.label}</p>
                         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">{a.sub}</p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                         <a.icon size={18} />
                      </div>
                   </div>
                </button>
              ))}
           </div>
           
           <div className="relative z-10 p-6 bg-slate-50 rounded-2xl border border-slate-50 text-center">
              <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest italic leading-relaxed">
                 Secure Staff Portal <br /> Portfolio Management v2.0
              </p>
           </div>
        </div>
      </section>
    </div>
  );
}
