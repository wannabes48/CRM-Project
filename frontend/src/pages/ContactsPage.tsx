import React, { useState } from 'react';
import { Search, Plus, MoreHorizontal, Mail, Phone, Building, Download, Loader2, Users } from 'lucide-react';
import NewContactModal from '../components/modals/NewContactModal';
import api from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
  created_at: string;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const fetchContacts = async () => {
    try {
      const response = await api.get('contacts/');
      const actualData = response.data.results ? response.data.results : response.data;

      console.log("Fetched Data:", actualData);
      setContacts(actualData);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      // 1. Tell Axios we are expecting a raw file, not JSON
      const response = await api.get('/contacts/export/', {
        responseType: 'blob',
      });

      // 2. Create a temporary URL for the downloaded data
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // 3. Create an invisible anchor tag
      const link = document.createElement('a');
      link.href = url;

      // 4. Force the download with a filename
      const dateStr = new Date().toISOString().split('T')[0];
      link.setAttribute('download', `Xentrix_Contacts_${dateStr}.csv`);

      // 5. Append, click, and cleanup
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url); // Free up memory

    } catch (error) {
      console.error("Failed to export contacts:", error);
      alert("There was an error exporting your contacts. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };
  React.useEffect(() => {
    fetchContacts();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-10 h-10 border-4 border-saas-neon border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500 text-gray-900 dark:text-gray-100 pb-12">
      {/* Header & Controls */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">Directory</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 font-medium">Manage your {contacts.length} total contacts.</p>
        </div>
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-4 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search contacts..."
              className="w-full bg-saas-surface border border-gray-200 dark:border-gray-800 rounded-2xl py-2.5 pl-12 pr-4 text-sm outline-none focus:border-saas-neon text-gray-900 dark:text-white transition-all shadow-sm"
            />
          </div>
          <button
            onClick={handleExportCSV}
            disabled={isExporting}
            className="flex items-center gap-2 bg-saas-surface hover:bg-saas-bg dark:hover:bg-saas-surfacehover border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-black py-2.5 px-6 rounded-2xl transition-all shadow-sm disabled:opacity-50 shrink-0 uppercase tracking-widest text-[10px]"
          >
            {isExporting ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
            <span className="hidden sm:inline">Export CSV</span>
          </button>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-saas-neon hover:bg-saas-neonhover text-white dark:text-black font-black py-2.5 px-6 rounded-2xl transition-all shadow-xl shadow-saas-neon/20 shrink-0 uppercase tracking-widest text-[10px]">
            <Plus size={18} strokeWidth={4} /> Add Contact
          </button>
        </div>
      </header>

      {/* Main Table Container */}
      <div className="flex-1 bg-saas-surface rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-2xl shadow-black/5 overflow-hidden flex flex-col ring-1 ring-black/5 dark:ring-white/5">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-50 dark:border-gray-800 bg-saas-bg/50 dark:bg-saas-surfacehover/50 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                <th className="p-6 pl-8 font-black">Contact Name</th>
                <th className="p-6 font-black">Company</th>
                <th className="p-6 font-black">Email Address</th>
                <th className="p-6 font-black">Phone</th>
                <th className="p-6 pr-8 text-right font-black">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
              {contacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-saas-bg dark:hover:bg-saas-surfacehover/30 transition-all group">
                  <td className="p-5 pl-8">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-saas-bg dark:bg-gray-800 flex items-center justify-center font-black text-gray-600 dark:text-gray-300 shadow-sm ring-1 ring-black/5 group-hover:scale-110 transition-transform">
                        {(contact.first_name?.charAt(0) || '')}{(contact.last_name?.charAt(0) || '')}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <Link to={`/contacts/${contact.id}`} className="font-black text-gray-900 dark:text-white hover:text-saas-neon transition-colors truncate tracking-tight">{contact.first_name} {contact.last_name}</Link>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-0.5">Added {new Date(contact.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-3 text-sm font-bold text-gray-600 dark:text-gray-400">
                      <div className="p-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <Building size={14} className="text-gray-400" />
                      </div>
                      {contact.company || '—'}
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-3 text-sm font-bold text-gray-600 dark:text-gray-400">
                      <div className="p-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <Mail size={14} className="text-gray-400" />
                      </div>
                      {contact.email}
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-3 text-sm font-bold text-gray-600 dark:text-gray-400">
                      <div className="p-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <Phone size={14} className="text-gray-400" />
                      </div>
                      {contact.phone || '—'}
                    </div>
                  </td>
                  <td className="p-5 pr-8 text-right">
                    <button className="p-2.5 rounded-xl text-gray-400 hover:text-saas-neon hover:bg-saas-neon/10 transition-all opacity-0 group-hover:opacity-100 shadow-sm border border-transparent hover:border-saas-neon/20">
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {contacts.length === 0 && (
            <div className="p-20 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-saas-bg rounded-2xl flex items-center justify-center mb-6">
                 <Users size={32} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">No contacts yet</h3>
              <p className="text-gray-600 dark:text-gray-400 font-medium">Get started by adding your first customer to the directory.</p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="mt-8 bg-saas-neon text-white dark:text-black font-black py-3 px-8 rounded-2xl shadow-xl shadow-saas-neon/20 hover:scale-105 transition-transform uppercase tracking-widest text-[10px]"
              >
                Add Your First Contact
              </button>
            </div>
          )}
        </div>
      </div>

      <NewContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchContacts}
      />
    </div>
  );
}