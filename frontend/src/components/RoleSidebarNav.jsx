import React, { useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, ChevronLeft, ChevronRight, Landmark } from 'lucide-react';
import { useAuth, normalizeRole } from '../context/AuthContext';
import { getSidebarConfigForRole } from '../config/sidebarMenus';
import { pathStringToTo, isSidebarItemActive } from '../utils/navActive';

export default function RoleSidebarNav({
  routeRole,
  isCollapsed,
  setIsSidebarCollapsed,
  onLinkClick,
}) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const effectiveRole = useMemo(() => {
    const fromAuth = normalizeRole(user?.role);
    const fromLs = normalizeRole(localStorage.getItem('role'));
    const fromRoute = normalizeRole(routeRole);
    return fromAuth || fromLs || fromRoute;
  }, [user?.role, routeRole]);

  const config = useMemo(() => {
    return getSidebarConfigForRole(effectiveRole) || getSidebarConfigForRole(routeRole);
  }, [effectiveRole, routeRole]);

  const nav = useMemo(() => config?.nav || [], [config]);
  const branding = config?.branding || {};
  const allPaths = useMemo(() => nav.map((item) => item.path), [nav]);

  const handleLogout = () => {
    // Determine portal type BEFORE clearing auth state
    const isAdminStaff = effectiveRole === 'ADMIN' || effectiveRole === 'STAFF';
    const isManagePath = location.pathname.startsWith('/admin') || location.pathname.startsWith('/staff') || location.pathname.startsWith('/manage');
    
    logout();

    if (isAdminStaff || isManagePath) {
      // Force return to management entry point
      window.location.href = '/manage';
    } else {
      window.location.href = '/login';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-100 relative z-10 transition-all duration-500">
      {/* Branding Area */}
      <div className={`p-6 flex items-center gap-3 transition-all duration-500 ${isCollapsed ? 'justify-center py-8' : ''}`}>
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 shrink-0">
           <Landmark size={22} strokeWidth={2.5} />
        </div>
        {!isCollapsed && (
          <div className="min-w-0">
            <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none uppercase">Demo<span className="text-primary">Loan</span></h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{branding.subtitle || 'Management'}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className={`flex-1 overflow-y-auto custom-scrollbar p-4 space-y-1 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
        {!isCollapsed && (
          <p className="px-4 pb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">
            Navigation
          </p>
        )}
        {nav.map((item) => {
          const Icon = item.icon;
          const active = isSidebarItemActive(location, item.path, allPaths);
          return (
            <Link
              key={item.key}
              to={pathStringToTo(item.path)}
              onClick={onLinkClick}
              title={isCollapsed ? item.label : ''}
              className={`sidebar-item ${isCollapsed ? 'w-10 h-10 justify-center' : 'px-4 py-3'} ${
                active ? 'sidebar-item-active' : 'sidebar-item-inactive'
              }`}
            >
              <Icon size={isCollapsed ? 22 : 18} strokeWidth={active ? 2.5 : 2} />
              {!isCollapsed && (
                <span className="truncate">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Control */}
      <div className={`p-4 space-y-2 border-t border-slate-50`}>
        <button
          onClick={handleLogout}
          className={`sidebar-item text-rose-500 hover:bg-rose-50 w-full ${isCollapsed ? 'justify-center' : 'px-4'}`}
        >
          <LogOut size={isCollapsed ? 22 : 18} />
          {!isCollapsed && <span>Log Out</span>}
        </button>

        {!isCollapsed && (
          <button
            onClick={() => setIsSidebarCollapsed(true)}
            className="flex items-center gap-3 px-4 py-2.5 w-full rounded-xl text-slate-400 hover:text-slate-600 transition-all font-bold text-[11px]"
          >
            <ChevronLeft size={16} />
            <span>Collapse</span>
          </button>
        )}
        
        {isCollapsed && (
          <button
            onClick={() => setIsSidebarCollapsed(false)}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-300 hover:text-primary transition-all"
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
