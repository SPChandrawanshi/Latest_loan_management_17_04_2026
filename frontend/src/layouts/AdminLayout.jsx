import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Menu, X, Bell, Search, User as UserIcon, Landmark } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import RoleSidebarNav from '../components/RoleSidebarNav';
import { useSidebarRoleConfig } from '../hooks/useSidebarRoleConfig';
import { isMobileNavItemActive, pathStringToTo } from '../utils/navActive';

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const { mobileNav, branding } = useSidebarRoleConfig('admin');

  React.useEffect(() => {
    const mainContent = document.querySelector('main');
    if (mainContent) mainContent.scrollTop = 0;
  }, [location.pathname, location.search]);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Mobile Sidebar Context */}
      <div className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 lg:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsSidebarOpen(false)} />
      
      <aside className={`fixed inset-y-0 left-0 w-[280px] z-[60] lg:hidden transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <RoleSidebarNav routeRole="admin" isCollapsed={false} setIsSidebarCollapsed={setIsSidebarCollapsed} onLinkClick={() => setIsSidebarOpen(false)} />
      </aside>

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col shrink-0 h-screen sticky top-0 bg-slate-900 overflow-hidden transition-all duration-300 ease-in-out z-50 shadow-[rgba(0,0,0,0.16)_0px_3px_6px,rgba(0,0,0,0.23)_0px_3px_6px] ${isSidebarCollapsed ? 'w-[80px]' : 'w-[260px]'}`}>
        <RoleSidebarNav routeRole="admin" isCollapsed={isSidebarCollapsed} setIsSidebarCollapsed={setIsSidebarCollapsed} onLinkClick={() => {}} />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Premium Header */}
        <header className="h-20 flex items-center justify-between px-4 md:px-8 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40 transition-shadow duration-300 shadow-[rgba(0,0,0,0.16)_0px_3px_6px,rgba(0,0,0,0.23)_0px_3px_6px]">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all border-none shadow-none">
              <Menu size={20} />
            </button>
            <div className="hidden lg:flex items-center gap-2 relative group w-64 xl:w-80">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
              <input type="text" placeholder="Search operations..." className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/10 focus:bg-white transition-all outline-none" />
            </div>
            <div className="flex lg:hidden items-center gap-2">
               <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                  <Landmark size={18} />
               </div>
               <h1 className="text-sm font-black text-slate-900 uppercase tracking-tighter">Demo <span className="text-primary">Loan</span></h1>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button className="hidden sm:flex w-10 h-10 items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-300 hover:text-primary hover:border-primary/20 transition-all relative">
              <Bell size={18} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </button>

            <div className="w-px h-6 bg-slate-200 hidden sm:block mx-1" />

            <Link to={branding.profilePath || '/admin/profile'} className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-2xl hover:bg-slate-50 transition-all group border-none shadow-none bg-transparent">
              <div className="text-right hidden md:block">
                <p className="text-sm font-black text-slate-900 leading-none uppercase tracking-tight">{user?.name?.split(' ')[0] || 'Admin'}</p>
                <p className="text-[10px] font-bold text-slate-300 mt-1 uppercase tracking-widest leading-none">Super Administrator</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-slate-900 flex items-center justify-center text-white ring-4 ring-slate-100 group-hover:ring-primary/10 transition-all">
                <UserIcon size={20} />
              </div>
            </Link>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-10 pb-28 lg:pb-10 overflow-y-auto custom-scrollbar">
          <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Outlet key={`${location.pathname}${location.search}`} />
          </div>
        </main>

        {/* Mobile bottom nav - Sleek Floating Style */}
        <nav className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-slate-900/90 backdrop-blur-xl rounded-[2rem] border border-white/10 z-40 p-2 shadow-2xl">
          <div className="flex justify-around items-center h-14">
            {mobileNav.map(({ path, label, icon: Icon }) => {
              const active = isMobileNavItemActive(location, path);
              return (
                <Link key={path} to={pathStringToTo(path)}
                  className={`flex flex-col items-center justify-center w-14 h-12 transition-all duration-300 ${active ? 'text-primary' : 'text-slate-300 active:scale-95'}`}>
                  <div className={`p-2 rounded-xl transition-all ${active ? 'bg-primary/10 text-primary' : ''}`}>
                    <Icon size={22} strokeWidth={active ? 2.5 : 2} />
                  </div>
                  <span className={`text-[9px] mt-1 font-bold uppercase tracking-widest ${active ? 'text-primary' : 'text-slate-300'}`}>{label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
