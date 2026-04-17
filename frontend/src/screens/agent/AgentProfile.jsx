import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  User, Mail, Phone, ShieldCheck, Camera, Edit3, LogOut, 
  MapPin, Award, TrendingUp, Users, CheckCircle2, ShieldAlert
} from 'lucide-react';
import { Btn, Modal, FormField, Input, Divider } from '../../components/UI';
import { loadSavedImage, saveImageLocally, fileToDataUrl } from '../../utils/fileUploads';

const DUMMY_AGENT = {
  name: 'Demo Partner',
  id: 'AGT-10294',
  email: 'agent@demo.com',
  phone: '+260 965 221 000',
  location: 'Lusaka HQ',
  trustScore: '99%',
  totalReferrals: 150,
  status: 'CERTIFIED AGENT'
};

export default function AgentProfile() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [editModal, setEditModal] = useState(false);
  
  // Use session name if available, else 'Victor Banda'
  const user = {
    ...DUMMY_AGENT,
    name: authUser?.name || 'Victor Banda',
    id: authUser?.id || 'AGT-10294'
  };
  
  const profileImageStorageKey = `agent-profile-photo:${user.id}`;
  const [profilePhoto, setProfilePhoto] = useState(() => loadSavedImage(profileImageStorageKey));

  const handleLogout = () => { window.location.href = '/login'; };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setProfilePhoto(dataUrl);
    saveImageLocally(profileImageStorageKey, dataUrl);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* ── AGENT HEADER CARD ── */}
      <section className="pro-card !py-12 flex flex-col items-center text-center space-y-6">
        <div className="relative group">
          <div className="w-32 h-32 rounded-[2rem] border border-slate-100 bg-slate-50 flex items-center justify-center text-slate-300 overflow-hidden shadow-sm">
            {profilePhoto ? (
              <img src={profilePhoto} alt="Agent" className="w-full h-full object-cover" />
            ) : (
              <User size={64} />
            )}
            <label className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center cursor-pointer text-white">
               <Camera size={20} />
               <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            </label>
          </div>
          <div className="absolute bottom-1 right-1 w-10 h-10 bg-[#0a3d62] rounded-xl border-4 border-white flex items-center justify-center text-white shadow-lg">
            <Award size={20} />
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="text-xl font-black text-slate-900 tracking-tight">{user.name}</h1>
          <div className="flex items-center justify-center gap-2">
             <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-widest">{user.status}</span>
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">• ID: {user.id}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4">
           <Btn variant="outline" size="sm" onClick={() => setEditModal(true)} className="!px-6 !bg-white">Edit Profile</Btn>
           <button onClick={handleLogout} className="h-10 px-6 rounded-xl border border-rose-100 text-rose-500 font-bold text-xs uppercase hover:bg-rose-50 transition-all">Log Out</button>
        </div>
      </section>

      {/* ── PARTNER STATS ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { label: 'Trust Score', value: user.trustScore, icon: ShieldCheck, color: 'text-emerald-500' },
           { label: 'Active Network', value: user.totalReferrals, icon: Users, color: 'text-[#0a3d62]' },
           { label: 'Market Reach', value: user.location, icon: MapPin, color: 'text-amber-500' }
         ].map((stat, i) => (
           <div key={i} className="pro-card p-6 flex flex-col items-center text-center space-y-2">
              <div className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center ${stat.color} mb-2`}>
                 <stat.icon size={20} />
              </div>
              <p className="text-xl font-black text-slate-900 leading-none">{stat.value}</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
           </div>
         ))}
      </div>

      {/* ── CONTACT & CREDENTIALS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="pro-card space-y-6">
           <div className="border-b border-slate-50 pb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-none">Contact Protocol</h3>
              <Mail size={18} className="text-slate-200" />
           </div>
           <div className="space-y-4">
              <div className="flex flex-col">
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Official Email</span>
                 <p className="text-sm font-bold text-slate-700">{user.email}</p>
              </div>
              <div className="flex flex-col">
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Business Line</span>
                 <p className="text-sm font-bold text-slate-700">{user.phone}</p>
              </div>
           </div>
        </div>

        <div className="pro-card space-y-6">
           <div className="border-b border-slate-50 pb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-none">Performance Growth</h3>
              <TrendingUp size={18} className="text-slate-200" />
           </div>
           <div className="space-y-4">
              <div className="p-4 bg-emerald-50/50 border border-emerald-100/50 rounded-2xl flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-emerald-500" />
                    <div>
                       <p className="text-xs font-bold text-slate-800 leading-none mb-1">Elite Status</p>
                       <p className="text-[10px] font-medium text-emerald-600 uppercase tracking-widest">Active Partner</p>
                    </div>
                 </div>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Your referral node is currently performing 15% better than last month. Keep building your network.
              </p>
           </div>
        </div>
      </div>

      <Modal isOpen={editModal} onClose={() => setEditModal(false)} title="Agent Settings">
         <div className="space-y-6 p-2">
            <FormField label="Full Name">
               <Input value={user.name} readOnly />
            </FormField>
            <FormField label="Mobile Number">
               <Input value={user.phone} readOnly />
            </FormField>
            <div className="flex justify-end pt-4">
               <Btn onClick={() => setEditModal(false)}>Close Registry</Btn>
            </div>
         </div>
      </Modal>

    </div>
  );
}
