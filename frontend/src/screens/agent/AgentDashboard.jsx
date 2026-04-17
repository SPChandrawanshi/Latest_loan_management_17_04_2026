import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Check, Copy, Wallet, Users, Activity, ArrowRight, TrendingUp, ShieldCheck, Sparkles, Zap, ChevronRight 
} from 'lucide-react';
import { PageTitle, StatusBadge, StatCard, Btn, Divider } from '../../components/UI';

const DUMMY_USER = { name: 'Victor Banda', id: 'AGT-0042', role: 'agent' };

const DUMMY_CLIENTS = [
  { id: 1, name: 'Michael Johnson', phone: '+260971001122', loans: [{ status: 'APPROVED' }] },
  { id: 2, name: 'Sarah Williams', phone: '+260971001133', loans: [{ status: 'PENDING' }] },
  { id: 3, name: 'David Brown', phone: '+260971001144', loans: [] },
];

const DUMMY_STATS = {
  totalClients: 12,
  activeLoans: 7,
  totalCommission: 8450,
  pendingPayout: 1200,
};

function formatMoney(value) {
  return `$${Number(value || 0).toLocaleString()}`;
}

export default function AgentDashboard() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const referralLink = `${window.location.origin}/register?ref=${DUMMY_USER.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* ── SIMPLE WELCOME HEADER ── */}
      <section className="pro-card !p-8 bg-white border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back, {DUMMY_USER.name}</h1>
           <p className="text-sm text-slate-500 font-medium mt-1">Here is a quick summary of your referral work today.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
           <Btn onClick={() => navigate('/agent/clients')} className="flex-1 md:flex-none !h-12 !rounded-xl !px-8">
              My Clients
           </Btn>
           <button 
             onClick={handleCopyLink}
             className={`flex-1 md:flex-none h-12 px-6 rounded-xl border text-[11px] font-bold uppercase tracking-widest transition-all ${copied ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100'}`}
           >
              {copied ? 'Link Copied!' : 'Copy Referral Link'}
           </button>
        </div>
      </section>

      {/* ── KEY NUMBERS (Simple Stat Boxes) ── */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Clients', value: DUMMY_STATS.totalClients, icon: Users, color: '#0a3d62' },
          { label: 'Active Loans', value: DUMMY_STATS.activeLoans, icon: Activity, color: '#f59e0b' },
          { label: 'My Earnings', value: formatMoney(DUMMY_STATS.totalCommission), icon: TrendingUp, color: '#10b981' },
          { label: 'Pending Payout', value: formatMoney(DUMMY_STATS.pendingPayout), icon: Wallet, color: '#64748b' },
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

      {/* ── RECENT ACTIVITY & NAVIGATION ── */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Referrals List */}
        <div className="lg:col-span-2 pro-card !p-0 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
             <h3 className="text-lg font-bold text-slate-900 tracking-tight">Recent Referrals</h3>
             <Btn variant="ghost" size="sm" onClick={() => navigate('/agent/clients')} className="!text-[10px] !px-3">View All</Btn>
          </div>
          <div className="divide-y divide-slate-50">
             {DUMMY_CLIENTS.map((client) => (
               <div key={client.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 font-bold text-sm uppercase">
                        {client.name[0]}
                     </div>
                     <div>
                        <p className="text-sm font-bold text-slate-800 leading-none mb-1">{client.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{client.phone}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <StatusBadge status={client.loans?.[0]?.status || 'IDENTIFIED'} />
                     <ArrowRight size={16} className="text-slate-200" />
                  </div>
               </div>
             ))}
          </div>
        </div>

        {/* Quick Actions sidebar */}
        <div className="pro-card space-y-6 bg-slate-50 border-slate-100">
           <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-none mb-1">Quick Actions</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Shortcut menu</p>
           </div>
           
           <div className="space-y-3">
              {[
                { label: 'Payout History', icon: Wallet, to: '/agent/payments' },
                { label: 'Earning Reports', icon: TrendingUp, to: '/agent/earnings' },
                { label: 'Notifications', icon: ShieldCheck, to: '/agent/notifications' }
              ].map((a, i) => (
                <button key={i} onClick={() => navigate(a.to)} className="w-full p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between hover:border-primary/20 hover:shadow-sm transition-all group">
                   <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                         <a.icon size={16} />
                      </div>
                      <span className="text-sm font-bold text-slate-700">{a.label}</span>
                   </div>
                   <ChevronRight size={14} className="text-slate-300" />
                </button>
              ))}
           </div>

           <div className="p-4 bg-white border border-slate-100 rounded-2xl">
              <p className="text-[10px] font-bold text-slate-400 leading-relaxed text-center">
                 Your account is in good standing. <br /> All referrals are tracked automatically.
              </p>
           </div>
        </div>

      </section>
    </div>
  );
}
