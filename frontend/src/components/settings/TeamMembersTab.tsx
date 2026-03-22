import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, MoreHorizontal, UserPlus, 
  Shield, Mail, Clock, Trash2, RefreshCw, ChevronRight,
  MoreVertical, CheckCircle2, Clock3, Ban, Loader2
} from 'lucide-react';
import api from '../../contexts/AuthContext';
import InviteMemberModal from '../modals/InviteMemberModal';

interface Member {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'SALES';
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  last_active: string | null;
}

interface Invitation {
  id: string;
  email: string;
  role: string;
  created_at: string;
  token: string;
}

export default function TeamMembersTab() {
  const [members, setMembers] = useState<Member[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'ADMIN' | 'MANAGER' | 'SALES'>('ALL');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [membersRes, invitesRes] = await Promise.all([
        api.get('team/'),
        api.get('invitations/')
      ]);
      setMembers(membersRes.data.results || membersRes.data);
      setInvitations(invitesRes.data.results || invitesRes.data);
    } catch (err) {
      console.error("Failed to fetch team data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateRole = async (memberId: string, newRole: string) => {
    setUpdatingId(memberId);
    try {
      await api.patch(`team/${memberId}/update_role/`, { role: newRole });
      await fetchData();
    } catch (err) {
      console.error("Failed to update role", err);
      alert("Failed to update role. Ensure you have proper permissions.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm("Are you sure you want to remove this member? They will lose access to the workspace.")) return;
    
    setUpdatingId(memberId);
    try {
      await api.delete(`team/${memberId}/`);
      await fetchData();
    } catch (err: any) {
      console.error("Failed to remove member", err);
      alert(err.response?.data?.[0] || "Failed to remove member.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleResendInvite = async (inviteId: string) => {
    try {
      await api.post(`invitations/${inviteId}/resend/`);
      alert("Invitation resent successfully!");
    } catch (err) {
      console.error("Failed to resend invite", err);
    }
  };

  const filteredMembers = members.filter(m => {
    const matchesSearch = (m.first_name + ' ' + m.last_name + ' ' + m.email).toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || m.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: string) => {
    const configs: any = {
      ADMIN: { bg: 'bg-indigo-500/10', text: 'text-indigo-500', label: 'Admin' },
      MANAGER: { bg: 'bg-purple-500/10', text: 'text-purple-500', label: 'Manager' },
      SALES: { bg: 'bg-saas-neon/10', text: 'text-saas-neon', label: 'Sales Rep' },
    };
    const config = configs[role] || configs.SALES;
    return (
      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-current/20 ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
     if (status === 'ACTIVE') return (
       <div className="flex items-center gap-2 text-emerald-500">
         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
         <span className="text-[10px] font-black uppercase tracking-widest">Active</span>
       </div>
     );
     if (status === 'SUSPENDED') return (
        <div className="flex items-center gap-2 text-red-500">
          <Ban size={12} />
          <span className="text-[10px] font-black uppercase tracking-widest">Suspended</span>
        </div>
      );
     return (
       <div className="flex items-center gap-2 text-orange-500">
         <Clock3 size={12} />
         <span className="text-[10px] font-black uppercase tracking-widest">Pending</span>
       </div>
     );
  };

  return (
    <div className="p-10 space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Team Members</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 font-medium">Manage workspace access and personnel logistics.</p>
        </div>
        <button 
          onClick={() => setIsInviteModalOpen(true)}
          className="flex items-center gap-3 bg-saas-neon hover:bg-saas-neonhover text-white dark:text-black font-black py-4 px-8 rounded-2xl transition-all shadow-xl shadow-saas-neon/20 uppercase tracking-[0.2em] text-xs group"
        >
          <UserPlus size={18} className="group-hover:scale-110 transition-transform" />
          Invite Member
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-saas-neon transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-saas-bg dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold outline-none focus:border-saas-neon/50 focus:ring-4 focus:ring-saas-neon/5 text-gray-900 dark:text-white transition-all shadow-sm ring-1 ring-black/[0.02]"
          />
        </div>
        <div className="flex items-center gap-2 bg-saas-bg dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 rounded-2xl px-4 py-2 ring-1 ring-black/[0.02]">
           <Filter size={16} className="text-gray-400" />
           <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="bg-transparent border-none outline-none text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 cursor-pointer"
           >
             <option value="ALL">All Roles</option>
             <option value="ADMIN">Admins</option>
             <option value="MANAGER">Managers</option>
             <option value="SALES">Sales Reps</option>
           </select>
        </div>
      </div>

      <div className="bg-white dark:bg-saas-surface border border-gray-100 dark:border-gray-800 rounded-[2rem] overflow-hidden shadow-2xl shadow-black/[0.02] ring-1 ring-black/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/20 border-b border-gray-100 dark:border-gray-800">
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Member</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Role</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Last Active</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <Loader2 className="animate-spin text-saas-neon mx-auto" size={32} />
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-4">Retrieving Personnel Data...</p>
                  </td>
                </tr>
              ) : filteredMembers.length === 0 && invitations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <p className="text-gray-400 text-sm font-bold italic">No team members matching your search.</p>
                  </td>
                </tr>
              ) : (
                <>
                  {/* Active & Existing Members */}
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="group hover:bg-saas-bg/50 dark:hover:bg-gray-800/10 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-saas-neon/10 border border-saas-neon/20 flex items-center justify-center text-sm font-black text-saas-neon shadow-sm group-hover:scale-110 transition-transform">
                            {member.first_name?.[0]}{member.last_name?.[0]}
                          </div>
                          <div>
                            <div className="text-sm font-black text-gray-900 dark:text-white tracking-tight">{member.first_name} {member.last_name}</div>
                            <div className="text-[10px] font-bold text-gray-400">{member.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="relative inline-block group/role">
                          {getRoleBadge(member.role)}
                          <div className="absolute top-0 left-0 w-full h-full opacity-0 group-hover/role:opacity-100 transition-opacity">
                             <select 
                               onChange={(e) => handleUpdateRole(member.id, e.target.value)}
                               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                               disabled={updatingId === member.id}
                             >
                                <option value="ADMIN">Admin</option>
                                <option value="MANAGER">Manager</option>
                                <option value="SALES">Sales Rep</option>
                             </select>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        {getStatusBadge(member.status)}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                           <Clock size={14} className="opacity-50" />
                           <span className="text-[11px] font-bold">
                             {member.last_active ? new Date(member.last_active).toLocaleDateString() : 'Never'}
                           </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleRemoveMember(member.id)}
                            disabled={updatingId === member.id}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all group/btn"
                            title="Remove Member"
                          >
                            <Trash2 size={18} className="group-hover/btn:scale-110 transition-transform" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-saas-neon hover:bg-saas-neon/5 rounded-xl transition-all">
                            <MoreVertical size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {/* Pending Invitations */}
                  {invitations.map((invite) => (
                    <tr key={invite.id} className="bg-indigo-50/20 dark:bg-indigo-500/[0.02] border-l-2 border-indigo-500/50">
                      <td className="px-8 py-6 opacity-60">
                         <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 shadow-sm italic font-black">?</div>
                           <div>
                             <div className="text-sm font-black text-gray-900 dark:text-white tracking-tight italic">Pending Invitation</div>
                             <div className="text-[10px] font-bold text-gray-400">{invite.email}</div>
                           </div>
                         </div>
                      </td>
                      <td className="px-8 py-6 opacity-60">
                        {getRoleBadge(invite.role)}
                      </td>
                      <td className="px-8 py-6">
                        {getStatusBadge('PENDING')}
                      </td>
                      <td className="px-8 py-6 opacity-60">
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                           <Clock size={14} className="opacity-50" />
                           <span className="text-[11px] font-bold">Invited {new Date(invite.created_at).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button 
                          onClick={() => handleResendInvite(invite.id)}
                          className="flex items-center gap-2 ml-auto px-4 py-2 bg-indigo-500/10 text-indigo-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500/20 transition-all border border-indigo-500/20 shadow-sm"
                        >
                          <RefreshCw size={12} />
                          Resend
                        </button>
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permission Legend / Insight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: <Shield className="text-indigo-500" />, title: 'Admin Control', desc: 'Can manage billing, full workspace config, and delete any personnel record.' },
          { icon: <Shield className="text-purple-500" />, title: 'Managerial Access', desc: 'Authorized to oversee all deals and contacts. Cannot manage Admins or Billing.' },
          { icon: <Shield className="text-saas-neon" />, title: 'Sales Rep Focus', desc: 'Dedicated viewport for personal deals and assigned leads. No system management.' }
        ].map((feat, i) => (
          <div key={i} className="p-6 bg-saas-bg dark:bg-gray-800/20 border border-gray-100 dark:border-gray-800 rounded-3xl flex items-start gap-4">
            <div className="mt-1">{feat.icon}</div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white mb-1.5">{feat.title}</h4>
              <p className="text-[10px] font-medium text-gray-500 leading-relaxed">{feat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <InviteMemberModal 
        isOpen={isInviteModalOpen} 
        onClose={() => setIsInviteModalOpen(false)} 
        onSuccess={fetchData} 
      />
    </div>
  );
}
