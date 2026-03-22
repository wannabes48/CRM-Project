import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Mail, Phone, Building, Calendar, 
  MoreVertical, Edit, Plus, Clock, Briefcase, 
  Tag, Loader2, MessageSquare, AlertCircle, ExternalLink, Shield
} from 'lucide-react';
import api from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function ContactDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { theme } = useTheme();
  const [contact, setContact] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'activity' | 'deals' | 'tickets'>('activity');

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await api.get(`contacts/${id}/`);
        setContact(res.data);
      } catch (err: any) {
        setError('Could not load contact details. They may have been deleted or you lack permission.');
      } finally {
        setLoading(false);
      }
    };
    fetchContact();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 h-screen flex items-center justify-center bg-saas-bg">
        <div className="w-12 h-12 border-4 border-saas-neon border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(178,255,77,0.3)]"></div>
      </div>
    );
  }

  if (error || !contact) {
    return (
      <div className="flex-1 p-8 flex flex-col items-center justify-center text-center bg-saas-bg min-h-screen animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-red-50 dark:bg-red-500/10 rounded-[2rem] flex items-center justify-center mb-8 border border-red-100 dark:border-red-500/20 shadow-sm">
           <AlertCircle size={40} className="text-red-500" strokeWidth={2.5} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3 uppercase tracking-tighter">Contact Missing</h2>
        <p className="text-gray-500 dark:text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-10">{error}</p>
        <Link to="/contacts" className="group flex items-center gap-3 bg-white dark:bg-saas-surface border border-gray-100 dark:border-gray-800 hover:border-saas-neon/30 text-gray-900 dark:text-white font-black py-4 px-8 rounded-2xl transition-all shadow-sm">
          <ArrowLeft size={16} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform" /> Return to Database
        </Link>
      </div>
    );
  }

  const initials = `${contact.first_name?.[0] || ''}${contact.last_name?.[0] || ''}`.toUpperCase();

  return (
    <div className="flex-1 bg-saas-bg min-h-screen animate-in fade-in duration-700">
      
      {/* Top Professional Header */}
      <div className="bg-white/80 dark:bg-saas-surface/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 px-8 py-6 flex items-center justify-between sticky top-0 z-30 transition-colors">
        <div className="flex items-center gap-6">
          <Link to="/contacts" className="group p-3 text-gray-400 hover:text-saas-neon bg-gray-50 dark:bg-saas-bg/50 rounded-2xl transition-all border border-transparent hover:border-saas-neon/20 shadow-sm">
            <ArrowLeft size={20} strokeWidth={2.5} className="group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-saas-neon/10 text-saas-neon flex items-center justify-center text-lg font-black border border-saas-neon/20 shadow-sm">
               {initials}
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none mb-1">{contact.first_name} {contact.last_name}</h1>
              <div className="flex items-center gap-2">
                 <div className="w-1 h-1 rounded-full bg-saas-neon animate-pulse"></div>
                 <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{contact.company || 'Private Portfolio'}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="hidden sm:flex items-center gap-3 bg-white dark:bg-saas-bg border border-gray-100 dark:border-gray-800 hover:border-saas-neon/30 text-gray-400 hover:text-saas-neon font-black py-3 px-6 rounded-2xl transition-all text-[10px] uppercase tracking-widest shadow-sm active:scale-95">
            <Edit size={16} strokeWidth={2.5} /> Edit Profile
          </button>
          <button className="flex items-center gap-3 bg-saas-neon hover:scale-105 active:scale-95 text-black font-black py-3 px-6 rounded-2xl transition-all shadow-xl shadow-saas-neon/20 text-[10px] uppercase tracking-widest">
            <Plus size={16} strokeWidth={3} /> Log Activity
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Essential Insights */}
          <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-32">
            <div className="bg-white dark:bg-saas-surface border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm group">
              <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-50 dark:border-gray-800/50">
                 <h2 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em]">Identity Hub</h2>
                 <Shield size={16} className="text-saas-neon opacity-50" />
              </div>

              <div className="space-y-8">
                <div className="group/item">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Professional Email</p>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-saas-bg/50 border border-gray-100 dark:border-gray-800 rounded-2xl group-hover/item:border-saas-neon/20 transition-all">
                    <Mail className="text-gray-400 dark:text-gray-500 group-hover/item:text-saas-neon transition-colors" size={20} />
                    <a href={`mailto:${contact.email}`} className="text-xs font-black text-gray-900 dark:text-white hover:text-saas-neon transition-colors truncate">{contact.email || '—'}</a>
                  </div>
                </div>

                <div className="group/item">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Secure Phone</p>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-saas-bg/50 border border-gray-100 dark:border-gray-800 rounded-2xl group-hover/item:border-saas-neon/20 transition-all">
                    <Phone className="text-gray-400 dark:text-gray-500 group-hover/item:text-saas-neon transition-colors" size={20} />
                    <p className="text-xs font-black text-gray-900 dark:text-white">{contact.phone || '—'}</p>
                  </div>
                </div>

                <div className="group/item">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Classifications</p>
                  <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-saas-bg/50 border border-gray-100 dark:border-gray-800 rounded-2xl group-hover/item:border-saas-neon/20 transition-all">
                    <Tag className="text-gray-400 dark:text-gray-500 group-hover/item:text-saas-neon transition-colors shrink-0 mt-0.5" size={20} />
                    <div className="flex flex-wrap gap-2">
                      {contact.tags && contact.tags.length > 0 ? (
                        contact.tags.map((tag: string, idx: number) => (
                          <span key={idx} className="bg-white dark:bg-saas-surface text-gray-600 dark:text-gray-300 text-[10px] font-black uppercase px-3 py-1.5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Unclassified</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-gray-50 dark:border-gray-800/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <Calendar className="text-gray-300" size={16} />
                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Added {new Date(contact.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
                  </div>
                  <ExternalLink size={14} className="text-gray-300 hover:text-saas-neon transition-colors cursor-pointer" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interaction OS */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Superior Tab Interface */}
            <div className="bg-white dark:bg-saas-surface border border-gray-100 dark:border-gray-800 rounded-[2rem] p-2 shadow-sm flex items-center gap-2">
              {[
                { id: 'activity', label: 'Timeline', icon: <Clock size={16} strokeWidth={2.5} /> },
                { id: 'deals', label: 'Pipeline', icon: <Briefcase size={16} strokeWidth={2.5} /> },
                { id: 'tickets', label: 'Tickets', icon: <MessageSquare size={16} strokeWidth={2.5} /> }
              ].map((tab: any) => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-4 px-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${activeTab === tab.id ? 'bg-saas-neon text-black shadow-lg shadow-saas-neon/20 animate-in zoom-in-95 duration-300' : 'text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-saas-bg/50'}`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content Visualization Module */}
            <div className="bg-white dark:bg-saas-surface border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-10 shadow-sm min-h-[600px] relative overflow-hidden group/content">
              
              {/* Timeline Engine */}
              {activeTab === 'activity' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between mb-10">
                     <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">Activity Interaction</h3>
                     <div className="w-10 h-1 bg-gray-100 dark:bg-gray-800 rounded-full"></div>
                  </div>
                  
                  {contact.activities && contact.activities.length > 0 ? (
                    <div className="relative border-l-2 border-gray-50 dark:border-gray-800 ml-5 space-y-12 pb-8">
                      {contact.activities.map((activity: any) => (
                        <div key={activity.id} className="relative pl-10">
                          {/* Advanced Timeline Node */}
                          <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-white dark:bg-saas-bg border-4 border-saas-neon shadow-lg shadow-saas-neon/30 z-10" />
                          
                          <div className="flex items-center justify-between mb-4">
                            <div className="px-3 py-1 bg-saas-neon/10 border border-saas-neon/20 rounded-lg">
                               <p className="text-[9px] font-black text-saas-neon uppercase tracking-widest leading-none">
                                 {activity.activity_type}
                               </p>
                            </div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-saas-bg/50 px-3 py-1 rounded-lg border border-gray-100 dark:border-gray-800">
                              {new Date(activity.created_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                            </p>
                          </div>
                          
                          <div className="bg-gray-50 dark:bg-saas-bg/50 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800/50 group-hover/content:shadow-xl group-hover/content:shadow-black/[0.02] transition-all duration-700">
                             <p className="text-xs font-bold text-gray-600 dark:text-gray-300 leading-relaxed uppercase tracking-tight italic">"{activity.description}"</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-[3rem]">
                      <div className="w-16 h-16 bg-gray-50 dark:bg-saas-bg/50 rounded-2xl flex items-center justify-center text-gray-300 dark:text-gray-700 mb-6">
                         <Clock size={32} />
                      </div>
                      <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-2">No historical data</p>
                      <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] max-w-xs leading-relaxed">System is awaiting first logged interaction or engagement pulse.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Pipeline Module */}
              {activeTab === 'deals' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">Forecasted Revenue</h3>
                    <button className="text-[10px] font-black text-saas-neon uppercase tracking-widest bg-saas-neon/10 px-4 py-2 rounded-xl border border-saas-neon/20 hover:scale-105 active:scale-95 transition-all shadow-sm">+ New Opportunity</button>
                  </div>
                  
                  {contact.deals && contact.deals.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {contact.deals.map((deal: any) => (
                        <div key={deal.id} className="bg-white dark:bg-saas-bg/50 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 hover:border-saas-neon/30 transition-all group/deal cursor-pointer shadow-sm active:scale-95 duration-500">
                          <div className="flex justify-between items-start mb-6">
                            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl group-hover/deal:bg-saas-neon group-hover/deal:text-black transition-colors duration-500">
                               <Briefcase size={20} />
                            </div>
                            <span className="bg-gray-50 dark:bg-saas-surface text-gray-400 dark:text-gray-500 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-gray-100 dark:border-gray-800">
                              {deal.stage}
                            </span>
                          </div>
                          <p className="font-black text-gray-900 dark:text-white uppercase tracking-tight text-xs mb-2 truncate">{deal.title}</p>
                          <p className="text-3xl font-black text-saas-neon mb-6 tracking-tighter">
                            ${parseFloat(deal.amount).toLocaleString(undefined, {minimumFractionDigits: 0})}
                          </p>
                          <div className="flex justify-between items-center pt-6 border-t border-gray-50 dark:border-gray-800/50">
                             <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-saas-neon animate-pulse"></div>
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{deal.probability}% Win Rate</span>
                             </div>
                             <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em]">{new Date(deal.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-[3rem]">
                      <div className="w-16 h-16 bg-gray-50 dark:bg-saas-bg/50 rounded-2xl flex items-center justify-center text-gray-300 dark:text-gray-700 mb-6">
                         <Briefcase size={32} />
                      </div>
                      <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-2">Zero Pipeline Load</p>
                      <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] max-w-xs leading-relaxed">No commercial opportunities have been registered for this entity.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Tickets Module */}
              {activeTab === 'tickets' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">Active Support Mesh</h3>
                    <button className="text-[10px] font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-saas-bg/50 px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-800 hover:text-saas-neon transition-all focus:ring-2 focus:ring-saas-neon/10">+ New Inquiry</button>
                  </div>

                  {contact.tickets && contact.tickets.length > 0 ? (
                    <div className="space-y-4">
                      {contact.tickets.map((ticket: any) => (
                        <div key={ticket.id} className="flex items-center justify-between p-6 bg-white dark:bg-saas-bg/50 border border-gray-100 dark:border-gray-800 rounded-[2rem] hover:border-saas-neon/30 transition-all group/row cursor-pointer shadow-sm active:scale-[0.99]">
                          <div className="flex items-center gap-5">
                            <div className={`w-12 h-12 rounded-2xl ${ticket.status === 'Resolved' ? 'bg-saas-neon/10 text-saas-neon border-saas-neon/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'} border flex items-center justify-center shrink-0 group-hover/row:scale-110 transition-transform duration-500 shadow-sm`}>
                               <MessageSquare size={20} strokeWidth={2.5} />
                            </div>
                            <div className="min-w-0">
                               <p className="text-[11px] font-black text-gray-900 dark:text-white truncate uppercase tracking-tight mb-1">{ticket.subject}</p>
                               <div className="flex items-center gap-3">
                                  <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{new Date(ticket.created_at).toLocaleDateString()}</span>
                                  <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                                  <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${ticket.priority === 'High' ? 'text-red-500' : 'text-gray-400'}`}>{ticket.priority} Priority</span>
                               </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                             <div className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border ${ticket.status === 'Resolved' ? 'bg-saas-neon/10 text-saas-neon border-saas-neon/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-sm'}`}>
                                {ticket.status}
                             </div>
                             <MoreVertical size={18} className="text-gray-300 opacity-0 group-hover/row:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-[3rem]">
                      <div className="w-16 h-16 bg-gray-50 dark:bg-saas-bg/50 rounded-2xl flex items-center justify-center text-gray-300 dark:text-gray-700 mb-6">
                         <MessageSquare size={32} />
                      </div>
                      <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-2">No Active Inquiries</p>
                      <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] max-w-xs leading-relaxed">No support incidents or tickets currently pending for this profile.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Ambient decoration */}
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-saas-neon/5 blur-[80px] rounded-full pointer-events-none group-hover/content:bg-saas-neon/10 transition-all duration-1000"></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}