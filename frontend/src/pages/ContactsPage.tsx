import React, { useState } from 'react';
import { Search, Plus, MoreHorizontal, Mail, Phone, Building } from 'lucide-react';
import NewContactModal from '../components/modals/NewContactModal';
import api from '../contexts/AuthContext';

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
  fetchContacts();

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-10 h-10 border-4 border-saas-neon border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500">
      {/* Header & Controls */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-black dark:text-white">Directory</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your {contacts.length} total contacts.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search contacts..." 
              className="w-full bg-white dark:bg-saas-surface border border-gray-200 dark:border-gray-800 rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:border-saas-neon text-black dark:text-white transition-colors"
            />
          </div>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-saas-neon hover:bg-[#9EE042] text-black font-bold py-2 px-4 rounded-xl transition-colors shadow-[0_0_15px_rgba(178,255,77,0.3)] shrink-0">
            <Plus size={18} strokeWidth={3} /> Add
          </button>
        </div>
      </header>

      {/* Main Table */}
      <div className="flex-1 bg-white dark:bg-saas-surface rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-saas-surfacehover/50 text-xs font-bold uppercase tracking-wider text-gray-400">
                <th className="p-4 pl-6 font-bold">Contact Name</th>
                <th className="p-4 font-bold">Company</th>
                <th className="p-4 font-bold">Email Address</th>
                <th className="p-4 font-bold">Phone</th>
                <th className="p-4 pr-6 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
              {contacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50 dark:hover:bg-saas-surfacehover/50 transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300">
                        {contact.first_name.charAt(0)}{contact.last_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-black dark:text-white">{contact.first_name} {contact.last_name}</p>
                        <p className="text-xs text-gray-500">Added {new Date(contact.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <Building size={14} className="text-gray-400" />
                      {contact.company}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-gray-400" />
                      {contact.email}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-gray-400" />
                      {contact.phone}
                    </div>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <button className="p-2 rounded-lg text-gray-400 hover:text-saas-neon hover:bg-saas-neon/10 transition-colors opacity-0 group-hover:opacity-100">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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