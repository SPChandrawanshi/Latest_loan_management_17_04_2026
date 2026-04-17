import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Activity, Zap, History,
  Users, AlertCircle, TrendingUp, HandCoins, ShieldCheck,
  CreditCard, PieChart, UserCheck, CalendarDays
} from 'lucide-react';
import { StatusBadge, StatCard, PageTitle, Btn, ProTable, Loader } from '../../components/UI';

const RECENT_LOANS_DUMMY = [
  { id: 'L-8821', user: { name: 'James Wilson' }, principalAmount: 25000, createdAt: '2024-10-14', status: 'pending' },
  { id: 'L-8819', user: { name: 'Sarah Jenkins' }, principalAmount: 12000, createdAt: '2024-10-13', status: 'active' },
  { id: 'L-8815', user: { name: 'Michael Chen' }, principalAmount: 55000, createdAt: '2024-10-12', status: 'active' },
  { id: 'L-8812', user: { name: 'Emma Thompson' }, principalAmount: 8000, createdAt: '2024-10-11', status: 'late' },
  { id: 'L-8809', user: { name: 'Robert Davis' }, principalAmount: 15000, createdAt: '2024-10-10', status: 'active' },
];

const TELEMETRY_DUMMY = [
  { icon: Activity, text: 'New borrower node detected', time: '2m', color: 'text-indigo-500', bg: 'bg-indigo-50/50' },
  { icon: ShieldCheck, text: 'Identity registry verified', time: '14m', color: 'text-emerald-500', bg: 'bg-emerald-50/50' },
  { icon: AlertCircle, text: 'Late fee protocol triggered', time: '1h', color: 'text-rose-500', bg: 'bg-rose-50/50' },
  { icon: Users, text: 'Partner dividend settled', time: '3h', color: 'text-amber-500', bg: 'bg-amber-50/50' },
];

function formatMoney(value) {
  return `$${Number(value || 0).toLocaleString()}`;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const stats = [
    { label: 'Total Portfolio', value: '$1,240,000', color: '#4f46e5', icon: TrendingUp, trend: '+12.5% this month' },
    { label: 'Active Contracts', value: '142', color: '#0ea5e9', icon: ShieldCheck, trend: 'All nodes secure' },
    { label: 'Accrued Interest', value: '$84,200', color: '#10b981', icon: HandCoins, trend: 'Net profit forecast' },
    { label: 'Delinquent Dues', value: '$12,450', color: '#f43f5e', icon: AlertCircle, trend: '4 accounts flagged' },
  ];

  if (loading) return <Loader full />;

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <PageTitle 
        title="Command Center" 
        subtitle="Real-time oversight of your global lending ecosystem"
        action={
          <div className="flex items-center gap-3">
            <Btn variant="outline" onClick={() => window.location.reload()}>
              <History size={16} className="mr-2" /> Refresh Spectrum
            </Btn>
            <Btn onClick={() => navigate('/admin/loans?status=pending')}>
              <Zap size={16} className="mr-2" /> Authorize Credits
            </Btn>
          </div>
        }
      />

      {/* Financial Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <StatCard 
            key={i}
            label={s.label}
            value={s.value}
            icon={s.icon}
            color={s.color}
            trend={s.trend}
          />
        ))}
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Loan requests pipeline */}
        <div className="xl:col-span-2 space-y-5">
          <div className="flex items-center justify-between px-1">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Active Operation Pipeline</h3>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time credit request flow</p>
            </div>
            <Btn variant="ghost" size="sm" onClick={() => navigate('/admin/loans')}>
              Full Ledger <ArrowRight size={14} className="ml-2" />
            </Btn>
          </div>

          <ProTable headers={[
            { label: 'Borrower Identity' },
            { label: 'Liquidity Request' },
            { label: 'Request Date' },
            { label: 'Protocol Status' },
            { label: 'Authorization', className: 'text-right' }
          ]}>
            {RECENT_LOANS_DUMMY.map((loan) => (
              <tr key={loan.id} className="group hover:bg-slate-50/50 transition-colors border-b border-transparent hover:border-[#0a3d62]">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-bold ring-4 ring-white shadow-sm transition-transform group-hover:scale-105">
                      {loan.user?.name?.[0]}
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-slate-800 transition-colors group-hover:text-primary">{loan.user?.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">REF: {loan.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <p className="text-[14px] font-bold text-slate-900">{formatMoney(loan.principalAmount)}</p>
                </td>
                <td className="px-6 py-5">
                  <p className="text-[12px] font-bold text-slate-400">{new Date(loan.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </td>
                <td className="px-6 py-5">
                  <StatusBadge status={loan.status} />
                </td>
                <td className="px-6 py-5 text-right">
                   <Btn size="sm" variant="outline" className="opacity-0 group-hover:opacity-100" onClick={() => navigate(`/admin/loans`)}>Review</Btn>
                </td>
              </tr>
            ))}
          </ProTable>
        </div>

        {/* Telemetry and analytics */}
        <div className="space-y-5">
          <div className="px-1">
             <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">System Intel</h3>
             <p className="text-[11px] font-bold text-slate-300 uppercase tracking-widest mt-1">Automated event stream</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
             {TELEMETRY_DUMMY.map((log, i) => (
               <div key={i} className="pro-card p-5 flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl ${log.bg} ${log.color} flex items-center justify-center border border-white`}>
                      <log.icon size={18} />
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-slate-700 tracking-tight">{log.text}</p>
                      <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-1">{log.time} ago</p>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-slate-200 group-hover:text-primary transition-colors" />
               </div>
             ))}
          </div>

          <div className="bg-slate-900 rounded-3xl p-8 text-white space-y-4 relative overflow-hidden shadow-2xl border-2 border-transparent hover:border-[#0a3d62] transition-all duration-300">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary blur-[60px] opacity-20" />
             <div className="relative z-10 space-y-2">
                <p className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Quick Summary</p>
                <h4 className="text-lg font-bold leading-tight">Total funds currently deployed across the entire network.</h4>
             </div>
             <div className="flex items-end justify-between relative z-10">
                <p className="text-3xl font-extrabold tracking-tight">$8.4M</p>
                <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-bold">
                   <TrendingUp size={12} /> +4.2%
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
