'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getLeads, updateLead, assignLead, deleteLead, getLeadHistory } from '@/app/actions/leads';
import { getAgents } from '@/app/actions/agents';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  MessageCircle, 
  Phone, 
  Mail, 
  Trash2, 
  UserPlus,
  Clock,
  ChevronRight,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LeadsPage() {
  const { data: session } = useSession();
  const [leads, setLeads] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const isAdmin = (session?.user as any)?.role === 'Admin';

  const loadLeads = async () => {
    setLoading(true);
    const data = await getLeads();
    setLeads(data);
    setLoading(false);
  };

  useEffect(() => {
    loadLeads();
    if (isAdmin) {
      getAgents().then(setAgents);
    }
  }, [isAdmin]);

  const filteredLeads = leads.filter(lead => {
    const matchesStatus = filterStatus === 'All' || lead.status === filterStatus;
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this lead?')) {
      await deleteLead(id);
      loadLeads();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Leads Management</h1>
          <p className="text-slate-500">Manage and track your property leads efficiently.</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={18} className="text-slate-400" />
          <select 
            className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2 pl-3 pr-8 text-sm focus:ring-2 focus:ring-blue-500/20"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Interested">Interested</option>
            <option value="Closed">Closed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Lead Info</th>
                <th className="px-6 py-4">Property Interest</th>
                <th className="px-6 py-4">Budget</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto" />
                  </td>
                </tr>
              ) : filteredLeads.map((lead) => (
                <tr key={lead._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 flex items-center justify-center font-bold">
                        {lead.name[0]}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{lead.name}</p>
                        <p className="text-xs text-slate-500">{lead.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">{lead.propertyInterest}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-300">
                    Rs. {(lead.budget / 1000000).toFixed(1)}M
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      lead.status === 'Closed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30' :
                      lead.status === 'New' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30' :
                      'bg-slate-100 text-slate-600 dark:bg-slate-800'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1.5 font-bold text-xs ${
                      lead.score === 'High' ? 'text-red-500' :
                      lead.score === 'Medium' ? 'text-amber-500' :
                      'text-green-500'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        lead.score === 'High' ? 'bg-red-500' :
                        lead.score === 'Medium' ? 'bg-amber-500' :
                        'bg-green-500'
                      }`} />
                      {lead.score}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setSelectedLead(lead)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <ChevronRight size={18} />
                      </button>
                      {isAdmin && (
                        <button 
                          onClick={() => handleDelete(lead._id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete Lead"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && filteredLeads.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-slate-500">No leads found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Lead Detail Modal */}
      <AnimatePresence>
        {selectedLead && (
          <LeadDetailModal 
            lead={selectedLead} 
            onClose={() => { setSelectedLead(null); loadLeads(); }} 
            isAdmin={isAdmin}
            agents={agents}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function LeadDetailModal({ lead, onClose, isAdmin, agents }: any) {
  const [activeTab, setActiveTab] = useState('info');
  const [history, setHistory] = useState<any[]>([]);
  const [isAssigning, setIsAssigning] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(lead.assignedTo?._id || '');

  useEffect(() => {
    getLeadHistory(lead._id).then(setHistory);
  }, [lead._id]);

  const handleAssign = async () => {
    if (!selectedAgent) return;
    await assignLead(lead._id, selectedAgent);
    onClose();
  };

  const openWhatsApp = () => {
    const phone = lead.phone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${phone}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl relative overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-blue-500/20">
              {lead.name[0]}
            </div>
            <div>
              <h2 className="text-xl font-bold">{lead.name}</h2>
              <p className="text-sm text-slate-500">{lead.propertyInterest}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-6 border-b border-slate-200 dark:border-slate-800">
          {['info', 'history', 'assignment'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-4 text-sm font-bold capitalize transition-all border-b-2 ${
                activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab === 'info' ? 'Lead Info' : tab === 'history' ? 'Activity Log' : 'Assignment'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-8 max-h-[60vh] overflow-y-auto">
          {activeTab === 'info' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Email Address</p>
                  <p className="font-semibold flex items-center gap-2"><Mail size={16} className="text-blue-500" /> {lead.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Phone Number</p>
                  <p className="font-semibold flex items-center gap-2"><Phone size={16} className="text-blue-500" /> {lead.phone}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Budget</p>
                  <p className="font-bold text-xl text-blue-600">Rs. {lead.budget.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Priority Score</p>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    lead.score === 'High' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {lead.score} Priority
                  </span>
                </div>
              </div>
              
              <div className="space-y-1 pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Agent Assigned</p>
                <p className="font-semibold">{lead.assignedTo?.name || 'Unassigned'}</p>
              </div>

              <div className="space-y-1 pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Notes</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl italic">
                  "{lead.notes || 'No notes provided.'}"
                </p>
              </div>

              <div className="pt-6 flex gap-4">
                <button 
                  onClick={openWhatsApp}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-500/20"
                >
                  <MessageCircle size={20} />
                  <span>Contact on WhatsApp</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
              {history.map((log) => (
                <div key={log._id} className="relative pl-8">
                  <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-500 flex items-center justify-center z-10">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{log.action}</p>
                    <p className="text-xs text-slate-500 mt-1">{log.details}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">By {log.performedBy.name}</span>
                      <span className="text-[10px] text-slate-300">•</span>
                      <span className="text-[10px] text-slate-400">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
              {history.length === 0 && <p className="text-center py-8 text-slate-500">No activity recorded yet.</p>}
            </div>
          )}

          {activeTab === 'assignment' && (
            <div className="space-y-6">
              {isAdmin ? (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Select Agent</label>
                    <select 
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500/20"
                      value={selectedAgent}
                      onChange={(e) => setSelectedAgent(e.target.value)}
                    >
                      <option value="">Select an agent...</option>
                      {agents.map((agent: any) => (
                        <option key={agent._id} value={agent._id}>{agent.name} ({agent.email})</option>
                      ))}
                    </select>
                  </div>
                  <button 
                    onClick={handleAssign}
                    disabled={!selectedAgent}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20"
                  >
                    Assign Lead
                  </button>
                </>
              ) : (
                <div className="text-center py-8">
                  <Shield size={48} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-500 font-medium">Only administrators can reassign leads.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
