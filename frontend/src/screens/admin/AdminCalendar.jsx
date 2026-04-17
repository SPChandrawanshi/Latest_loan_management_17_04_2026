import React, { useMemo, useState } from 'react';
import { CalendarDays, AlertTriangle, History, RefreshCw, Zap, Timer, ChevronRight } from 'lucide-react';
import { PageTitle, StatusBadge, StatCard, Btn } from '../../components/UI';

const DUMMY_UPCOMING = [
  { id: 'PAY-101', loanId: 'LN-501', client: 'Alice Wilson', amount: 150, dueDate: 'Today', status: 'pending' },
  { id: 'PAY-102', loanId: 'LN-502', client: 'Bob Thompson', amount: 200, dueDate: 'Today', status: 'pending' },
  { id: 'PAY-103', loanId: 'LN-503', client: 'Charlie Davis', amount: 120, dueDate: 'Tomorrow', status: 'pending' },
  { id: 'PAY-104', loanId: 'LN-504', client: 'Diana Prince', amount: 300, dueDate: '2 days', status: 'pending' },
];

const DUMMY_LATE = [
  { id: 'PAY-099', loanId: 'LN-499', client: 'Edward Norton', amount: 450, penalty: 25, delay: '3 days', status: 'late' },
  { id: 'PAY-098', loanId: 'LN-498', client: 'Felix Wright', amount: 180, penalty: 15, delay: '1 week', status: 'late' },
];

function formatMoney(value) {
  return `$${Number(value || 0).toLocaleString()}`;
}

export default function AdminCalendar() {
  const [loading, setLoading] = useState(false);
  const [upcoming] = useState(DUMMY_UPCOMING);
  const [latePayments] = useState(DUMMY_LATE);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  const todayList = useMemo(() => upcoming.filter(p => p.dueDate === 'Today'), [upcoming]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <PageTitle 
        title="Collection Schedule" 
        subtitle="Monitor upcoming disbursements and overdue recoveries across the network" 
        action={
          <Btn variant="outline" size="md" onClick={handleRefresh} loading={loading}>
             <RefreshCw size={16} className="mr-2" /> 
             Synchronize Registry
          </Btn>
        }
      />

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Scheduled Dues" value={upcoming.length} icon={CalendarDays} color="text-primary" />
        <StatCard label="Immediate Attention" value={todayList.length} icon={Timer} color="text-amber-500" />
        <StatCard label="Overdue Liabilities" value={latePayments.length} icon={AlertTriangle} color="text-rose-500" />
      </section>

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Upcoming Collections */}
        <div className="pro-card overflow-hidden flex flex-col group">
          <div className="p-8 border-b border-slate-50 bg-slate-50/50">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <Zap size={20} />
               </div>
               <div>
                  <h2 className="text-lg font-bold text-slate-800 tracking-tight">Active Collections</h2>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Institutional nodes due today</p>
               </div>
            </div>
          </div>
          
          <div className="divide-y divide-slate-50">
            {todayList.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-6 hover:bg-slate-50/50 transition-all group/item">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center font-bold text-xs uppercase">
                     {payment.client[0]}
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-slate-800 group-hover/item:text-primary transition-colors">{payment.client}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">ID: {payment.loanId}</span>
                       <span className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none">{formatMoney(payment.amount)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                   <StatusBadge status="pending" />
                   <ChevronRight size={16} className="text-slate-200 group-hover/item:text-primary transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Late Payments */}
        <div className="pro-card overflow-hidden flex flex-col group">
          <div className="p-8 border-b border-slate-50 bg-rose-50/30">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-xl bg-white border border-rose-100 shadow-sm flex items-center justify-center text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-all">
                  <AlertTriangle size={20} />
               </div>
               <div>
                  <h2 className="text-lg font-bold text-slate-800 tracking-tight">Recovery Registry</h2>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Exceeded grace period thresholds</p>
               </div>
            </div>
          </div>

          <div className="divide-y divide-slate-50">
            {latePayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-6 hover:bg-rose-50/50 transition-all group/item">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-400 flex items-center justify-center font-bold text-xs uppercase">
                     {payment.client[0]}
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-slate-800 group-hover/item:text-rose-500 transition-colors">{payment.client}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-0.5">
                      <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest px-2 py-0.5 bg-rose-50 rounded">Late: {payment.delay}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{formatMoney(payment.amount + payment.penalty)} Liability</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                   <StatusBadge status="late" />
                   <ChevronRight size={16} className="text-slate-200 group-hover/item:text-rose-500 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
