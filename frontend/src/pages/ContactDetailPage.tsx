import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Mail, Phone, Building, Calendar, 
  MoreVertical, Edit, Plus, Clock, Briefcase, 
  Tag, Loader2, MessageSquare, AlertCircle
} from 'lucide-react';
import api from '../contexts/AuthContext'; // Adjust path to your Axios instance

export default function ContactDetailPage() {
  const { id } = useParams<{ id: string }>();
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
      <div className="flex-1 h-screen flex items-center justify-center bg-gray-50 dark:bg-[#09090B]">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
      </div>
    );
  }

  if (error || !contact) {
    return (
      <div className="flex-1 p-8 flex flex-col items-center justify-center text-center bg-gray-50 dark:bg-[#09090B] min-h-screen">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Contact Not Found</h2>
        <p className="text-gray-500 mb-6">{error}</p>
        <Link to="/contacts" className="text-emerald-600 font-bold hover:underline">Return to Contacts</Link>
      </div>
    );
  }

  // Get initials for the avatar
  const initials = `${contact.first_name?.[0] || ''}${contact.last_name?.[0] || ''}`.toUpperCase();

  return (
    <div className="flex-1 bg-gray-50 dark:bg-[#09090B] min-h-screen">
      
      {/* Top Navigation */}
      <div className="bg-white dark:bg-[#151516] border-b border-gray-200 dark:border-gray-800 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link to="/contacts" className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-50 dark:bg-gray-800/50 rounded-xl transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{contact.first_name} {contact.last_name}</h1>
            <p className="text-sm text-gray-500">{contact.company || 'No Company'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold py-2 px-4 rounded-xl transition-colors text-sm">
            <Edit size={16} /> Edit
          </button>
          <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-xl transition-colors text-sm shadow-sm">
            <Plus size={16} /> Log Activity
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Contact Details (Sticky) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-[#151516] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm sticky top-28">
              
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-xl font-black shrink-0 border border-emerald-200 dark:border-emerald-500/30">
                  {initials}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">{contact.first_name} {contact.last_name}</h2>
                  <p className="text-sm text-gray-500">{contact.company || 'Unknown Company'}</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <Mail className="text-gray-400 mt-0.5" size={18} />
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase">Email</p>
                    <a href={`mailto:${contact.email}`} className="text-sm text-emerald-600 hover:underline">{contact.email || '—'}</a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="text-gray-400 mt-0.5" size={18} />
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase">Phone</p>
                    <p className="text-sm text-gray-900 dark:text-white">{contact.phone || '—'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Tag className="text-gray-400 mt-0.5" size={18} />
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {contact.tags && contact.tags.length > 0 ? (
                        contact.tags.map((tag: string, idx: number) => (
                          <span key={idx} className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs px-2.5 py-1 rounded-md border border-gray-200 dark:border-gray-700">
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">—</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <Calendar className="text-gray-400 mt-0.5" size={18} />
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase">Created</p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {new Date(contact.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Tabbed Interface */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Tabs */}
            <div className="bg-white dark:bg-[#151516] border border-gray-200 dark:border-gray-800 rounded-2xl p-2 shadow-sm flex items-center gap-2">
              <button 
                onClick={() => setActiveTab('activity')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'activity' ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
              >
                <Clock size={16} /> Activity
              </button>
              <button 
                onClick={() => setActiveTab('deals')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'deals' ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
              >
                <Briefcase size={16} /> Deals
              </button>
              <button 
                onClick={() => setActiveTab('tickets')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'tickets' ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
              >
                <MessageSquare size={16} /> Tickets
              </button>
            </div>

            {/* Tab Content Areas */}
            <div className="bg-white dark:bg-[#151516] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm min-h-[500px]">
              
              {/* ACTIVITY TAB */}
              {activeTab === 'activity' && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Activity Timeline</h3>
                  
                  {contact.activities && contact.activities.length > 0 ? (
                    <div className="relative border-l-2 border-gray-100 dark:border-gray-800 ml-3 space-y-8">
                      {contact.activities.map((activity: any) => (
                        <div key={activity.id} className="relative pl-6">
                          {/* Timeline Dot */}
                          <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700 border-4 border-white dark:border-[#151516]" />
                          
                          <p className="text-sm font-bold text-gray-900 dark:text-white capitalize mb-1">
                            {activity.activity_type}
                          </p>
                          <p className="text-xs text-gray-500 mb-2">
                            {new Date(activity.created_at).toLocaleString()}
                          </p>
                          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                            {activity.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
                      <Clock size={32} className="mx-auto text-gray-400 mb-3" />
                      <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">No recent activity</p>
                      <p className="text-xs text-gray-500">Log a call, email, or meeting to start building a history.</p>
                    </div>
                  )}
                </div>
              )}

              {/* DEALS TAB */}
              {activeTab === 'deals' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Associated Deals</h3>
                    <button className="text-sm text-emerald-600 font-bold hover:underline">+ New Deal</button>
                  </div>
                  
                  {contact.deals && contact.deals.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {contact.deals.map((deal: any) => (
                        <div key={deal.id} className="border border-gray-200 dark:border-gray-800 rounded-xl p-4 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors group cursor-pointer">
                          <div className="flex justify-between items-start mb-2">
                            <p className="font-bold text-gray-900 dark:text-white group-hover:text-emerald-600">{deal.title}</p>
                            <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold px-2 py-1 rounded">
                              {deal.stage}
                            </span>
                          </div>
                          <p className="text-2xl font-black text-gray-900 dark:text-white mb-1">
                            ${parseFloat(deal.amount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                          </p>
                          <p className="text-xs text-gray-500">
                            Created {new Date(deal.created_at).toLocaleDateString()} • {deal.probability}% Probability
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
                      <Briefcase size={32} className="mx-auto text-gray-400 mb-3" />
                      <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">No active deals</p>
                      <p className="text-xs text-gray-500">Create a deal to start tracking pipeline revenue.</p>
                    </div>
                  )}
                </div>
              )}

              {/* TICKETS TAB */}
              {activeTab === 'tickets' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Support Tickets</h3>
                    <button className="text-sm text-emerald-600 font-bold hover:underline">+ New Ticket</button>
                  </div>

                  {contact.tickets && contact.tickets.length > 0 ? (
                    <div className="space-y-3">
                      {contact.tickets.map((ticket: any) => (
                        <div key={ticket.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white mb-1">{ticket.subject}</p>
                            <p className="text-xs text-gray-500">
                              Opened {new Date(ticket.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                              ticket.priority === 'Urgent' ? 'bg-red-100 text-red-700' :
                              ticket.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                              'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                            }`}>
                              {ticket.priority}
                            </span>
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                              ticket.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {ticket.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
                      <MessageSquare size={32} className="mx-auto text-gray-400 mb-3" />
                      <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">No open tickets</p>
                      <p className="text-xs text-gray-500">This customer has no active support requests.</p>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}