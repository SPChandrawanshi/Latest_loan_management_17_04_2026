import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, Phone, Mail, TrendingUp, Globe, Activity, ChevronRight, Briefcase, ArrowRight } from 'lucide-react';
import { PageTitle, StatusBadge, StatCard, Input, EmptyState, Btn } from '../../components/UI';

const DUMMY_CLIENTS = [
  { id: 1, name: 'Michael Johnson', phone: '+260971001122', email: 'michael@email.com', loans: [{ status: 'APPROVED', principalAmount: 5000, interestRate: 10 }] },
  { id: 2, name: 'Sarah Williams', phone: '+260971001133', email: 'sarah@email.com', loans: [{ status: 'PENDING', principalAmount: 8500, interestRate: 10 }] },
  { id: 3, name: 'David Brown', phone: '+260971001144', email: 'david@email.com', loans: [] },
  { id: 4, name: 'Emma Thompson', phone: '+260971001155', email: 'emma@email.com', loans: [{ status: 'APPROVED', principalAmount: 12000, interestRate: 12 }] },
  { id: 5, name: 'James Wilson', phone: '+260971001166', email: 'james@email.com', loans: [{ status: 'APPROVED', principalAmount: 2500, interestRate: 8 }] },
];

export default function AgentClients() {
  const navigate = useNavigate();
  const clients = DUMMY_CLIENTS;
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClients = clients.filter(c =>
    (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.id || '').toString().includes(searchQuery)
  );

  const totalAssets = clients.reduce((sum, c) => sum + (c.loans || []).reduce((total, l) => total + Number(l.principalAmount || 0), 0), 0);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* ── UNIFIED DASHBOARD HEADER ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Consolidated Client Registry</h1>
          <p className="text-sm text-slate-500 font-medium">Performance auditing and lifecycle management for your referred borrower network.</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 shrink-0">
          <div className="px-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-1 min-w-[180px]">
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Market Share</p>
             <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-slate-900">{clients.length} <span className="text-xs text-slate-300 ml-1">Nodes</span></span>
                <Globe size={20} className="text-indigo-500 opacity-20" />
             </div>
          </div>
          <div className="px-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-1 min-w-[180px]">
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Managed Assets</p>
             <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-slate-900">K{(totalAssets/1000).toFixed(1)}k</span>
                <TrendingUp size={20} className="text-emerald-500 opacity-40" />
             </div>
          </div>
        </div>
      </div>

      {/* ── TOOLBAR SECTION ── */}
      <div className="flex items-center gap-4 p-2 bg-slate-100 rounded-2xl border border-slate-50">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by name, ID, or wallet address..."
            className="w-full h-12 pl-12 pr-6 bg-white border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none"
          />
        </div>
        <Btn variant="outline" className="!bg-white !h-12 !px-5 !rounded-lg shrink-0">
           <Activity size={16} />
        </Btn>
      </div>

      {/* ── CLIENT GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {filteredClients.length > 0 ? (
           filteredClients.map(cl => {
            const hasLoan = cl.loans?.length > 0;
            const status = cl.loans?.[0]?.status || 'IDENTIFIED';
            
            return (
              <div key={cl.id} className="pro-card !p-0 overflow-hidden group hover:border-primary/20 transition-all flex flex-col h-full bg-white">
                 <div className="p-6 pb-2 flex-1">
                    <div className="flex items-start justify-between mb-6">
                       <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300">
                          <Users size={24} />
                       </div>
                       <StatusBadge status={status} />
                    </div>

                    <div className="space-y-1 mb-6">
                      <h4 className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-primary transition-colors">{cl.name}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">REGISTRY NODE: CL_{cl.id}</p>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-slate-50">
                        <div className="flex items-center gap-3 text-slate-400">
                           <Phone size={14} />
                           <span className="text-xs font-bold text-slate-600 tracking-tight">{cl.phone}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-400">
                           <Mail size={14} />
                           <span className="text-xs font-bold truncate tracking-tight">{cl.email}</span>
                        </div>
                    </div>
                 </div>

                 <div className="px-6 py-5 border-t border-slate-50 bg-slate-50/50 flex items-center justify-between shrink-0">
                    <div className="space-y-1">
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Principal Asset</p>
                       <p className="text-lg font-black text-slate-900 leading-none">K{Number(cl.loans?.[0]?.principalAmount || 0).toLocaleString()}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-emerald-600 shadow-sm">
                       <span className="text-[10px] font-black">{cl.loans?.[0]?.interestRate || 0}%</span>
                    </div>
                 </div>
              </div>
            );
           })
         ) : (
           <div className="col-span-full">
              <EmptyState 
                icon={Briefcase}
                title="Network Fragmented"
                description="No borrower entities found in this specific quadrant. Adjust your filters or provision new client profiles."
              />
           </div>
         )}
      </div>
    </div>
  );
}
