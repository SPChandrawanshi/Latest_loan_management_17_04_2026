import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LogOut, 
  Phone, 
  Shield, 
  Edit3, 
  Lock, 
  Camera, 
  Upload, 
  Gift, 
  ShieldCheck, 
  User, 
  ArrowRight,
  UserCircle2,
  Mail,
  ShieldAlert,
  Save,
  CheckCircle2,
  Activity
} from 'lucide-react';
import { PageTitle, Btn, Input, Modal, FormField, Divider } from '../../components/UI';
import { fileToDataUrl, loadSavedImage, saveImageLocally } from '../../utils/fileUploads';

const DUMMY_USER = {
  name: 'John Borrower',
  phone: '+260 971 009 900',
  nrc: 'NRC-200188',
  role: 'BORROWER',
  initials: 'JB',
  id: 'BRW-0019',
  email: 'john.borrower@demo.com'
};

export default function BorrowerProfile() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const user = {
    ...DUMMY_USER,
    name: authUser?.name || 'John Borrower',
    id: authUser?.id || 'BRW-0019'
  };
  const [toastMsg, setToastMsg] = useState('');
  const [editModal, setEditModal] = useState(false);
  const profileImageStorageKey = `profile-photo:${user?.id || 'borrower'}`;
  const [profilePhoto, setProfilePhoto] = useState(() => loadSavedImage(profileImageStorageKey));
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    newPassword: '',
    confirmPassword: '',
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleLogout = () => { navigate('/login'); };

  const handleProfilePhotoChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setProfilePhoto(dataUrl);
    saveImageLocally(profileImageStorageKey, dataUrl);
    showToast('Profile Photo Updated');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* ── SIMPLE PROFILE HEADER ── */}
      <section className="pro-card !py-12 flex flex-col items-center text-center space-y-6">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full border border-slate-100 bg-slate-50 flex items-center justify-center text-slate-300 overflow-hidden shadow-sm">
            {profilePhoto ? (
              <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={64} />
            )}
            <label className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center cursor-pointer text-white">
               <Camera size={20} />
               <input type="file" accept="image/*" className="hidden" onChange={handleProfilePhotoChange} />
            </label>
          </div>
          <div className="absolute bottom-1 right-1 w-8 h-8 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center text-white shadow-lg">
            <ShieldCheck size={16} />
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="text-xl font-black text-slate-900 tracking-tight">{user.name}</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.role} • ID: {user.id}</p>
        </div>

        <div className="flex items-center gap-3 pt-4">
           <Btn variant="outline" size="sm" onClick={() => setEditModal(true)} className="!px-6 !bg-white">Edit Profile</Btn>
           <button onClick={handleLogout} className="h-10 px-6 rounded-xl border border-rose-100 text-rose-500 font-bold text-xs uppercase hover:bg-rose-50 transition-all">Log Out</button>
        </div>
      </section>

      {/* ── INFO BLOCKS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Personal Details */}
        <div className="pro-card space-y-6">
           <div className="border-b border-slate-50 pb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-none">Personal Details</h3>
              <UserCircle2 size={18} className="text-slate-200" />
           </div>
           <div className="space-y-4">
              {[
                { label: 'Email Address', value: user.email, icon: Mail },
                { label: 'Mobile Number', value: user.phone, icon: Phone },
                { label: 'Identity Ref', value: user.nrc, icon: Shield }
              ].map((item, i) => (
                <div key={i} className="flex flex-col">
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{item.label}</span>
                   <p className="text-sm font-bold text-slate-700">{item.value}</p>
                </div>
              ))}
           </div>
        </div>

        {/* Security & Verification */}
        <div className="pro-card space-y-6">
           <div className="border-b border-slate-50 pb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-none">Security Status</h3>
              <ShieldCheck size={18} className="text-slate-200" />
           </div>
           <div className="space-y-4">
              <div className="p-4 bg-emerald-50/50 border border-emerald-100/50 rounded-2xl flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-emerald-500" />
                    <div>
                       <p className="text-xs font-bold text-slate-800 leading-none mb-1">Authenticated</p>
                       <p className="text-[10px] font-medium text-emerald-600 uppercase tracking-widest">Active Member</p>
                    </div>
                 </div>
              </div>
              <div className="p-4 bg-amber-50/50 border border-amber-100/50 rounded-2xl flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <Activity size={18} className="text-amber-500" />
                    <div>
                       <p className="text-xs font-bold text-slate-800 leading-none mb-1">KYC Registry</p>
                       <p className="text-[10px] font-medium text-amber-600 uppercase tracking-widest">In Progress</p>
                    </div>
                 </div>
                 <Btn variant="ghost" size="sm" className="!text-[9px] !px-3">Update</Btn>
              </div>
           </div>
        </div>

      </div>

      <div className="pro-card flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-50 border-slate-200/50">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-slate-100"><ShieldAlert size={20} className="text-slate-400" /></div>
            <div>
               <h4 className="text-sm font-bold text-slate-900 leading-none mb-1">Account Security</h4>
               <p className="text-xs text-slate-500 font-medium">Keep your credentials secure and never share your password.</p>
            </div>
         </div>
         <Btn variant="outline" size="sm" onClick={() => setEditModal(true)} className="!bg-white !px-6">Update Password</Btn>
      </div>

      <Modal isOpen={editModal} onClose={() => setEditModal(false)} title="Update Personal Information">
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Full Legal Name">
               <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </FormField>
            <FormField label="Email Registry">
               <Input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </FormField>
          </div>
          
          <Divider text="Security Credentials" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="New Security Token">
               <Input type="password" placeholder="••••••••" value={form.newPassword} onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))} />
            </FormField>
            <FormField label="Confirm Token">
               <Input type="password" placeholder="••••••••" value={form.confirmPassword} onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))} />
            </FormField>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Btn variant="outline" className="!rounded-xl" onClick={() => setEditModal(false)}>Cancel</Btn>
            <Btn className="!rounded-xl !px-10" onClick={() => { setEditModal(false); showToast('Profile Updated'); }}>
              <Save size={16} className="mr-2" /> Save Profile
            </Btn>
          </div>
        </div>
      </Modal>

      {/* Modern Toast */}
      {toastMsg && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-10">
          <div className="bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[300px]">
            <CheckCircle2 className="text-emerald-400" size={24} />
            <span className="text-sm font-bold tracking-tight">{toastMsg}</span>
          </div>
        </div>
      )}
    </div>
  );
}
