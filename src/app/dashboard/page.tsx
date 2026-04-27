'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { getDashboardStats, getLeads } from '@/app/actions/leads';
import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight,
  Plus
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import NewLeadModal from '@/components/NewLeadModal';

export default function DashboardOverview() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<any>(null);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    if ((session?.user as any)?.role === 'Admin') {
      const dashboardStats = await getDashboardStats();
      setStats(dashboardStats);
    }
    const leads = await getLeads();
    setRecentLeads(leads.slice(0, 5));
    setLoading(false);
  };

  useEffect(() => {
    if (session) loadData();
  }, [session]);

  if (loading) return <div className="flex items-center justify-center h-full">
    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
  </div>;

  const isAdmin = (session?.user as any)?.role === 'Admin';

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Good Morning, {session?.user?.name?.split(' ')[0]}!</h1>
          <p className="text-slate-500">Here's what's happening with your leads today.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 font-semibold active:scale-95"
        >
          <Plus size={18} />
          <span>New Lead</span>
        </button>
      </header>

      <AnimatePresence>
        {isModalOpen && (
          <NewLeadModal 
            onClose={() => setIsModalOpen(false)} 
            onSuccess={loadData}
          />
        )}
      </AnimatePresence>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Leads" 
          value={isAdmin ? stats?.totalLeads : recentLeads.length} 
          icon={Users} 
          color="blue" 
          trend="+12%" 
        />
        <StatCard 
          label="Conversion Rate" 
          value="24.8%" 
          icon={TrendingUp} 
          color="green" 
          trend="+3%" 
        />
        <StatCard 
          label="Pending Follow-ups" 
          value="12" 
          icon={Clock} 
          color="amber" 
          trend="Action required" 
        />
        <StatCard 
          label="Closed Deals" 
          value={isAdmin ? (stats?.statusDistribution?.find((s:any) => s.name === 'Closed')?.value || 0) : 0} 
          icon={CheckCircle2} 
          color="indigo" 
          trend="+2" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-8">
          {isAdmin && stats && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-lg font-bold mb-6">Lead Status Distribution</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.statusDistribution}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-lg">Recent Leads</h3>
              <button className="text-blue-600 text-sm font-semibold hover:underline">View All</button>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentLeads.map((lead: any) => (
                <div key={lead._id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500">
                      {lead.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{lead.name}</p>
                      <p className="text-xs text-slate-500">{lead.propertyInterest}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      lead.score === 'High' ? 'bg-red-100 text-red-600 dark:bg-red-900/20' :
                      lead.score === 'Medium' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/20' :
                      'bg-green-100 text-green-600 dark:bg-green-900/20'
                    }`}>
                      {lead.score}
                    </span>
                    <p className="text-xs text-slate-400 mt-1">{new Date(lead.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
              {recentLeads.length === 0 && (
                <div className="p-8 text-center text-slate-500">
                  <AlertCircle className="mx-auto mb-2 text-slate-300" size={32} />
                  <p>No leads found.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          {isAdmin && stats?.agentPerformance && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="font-bold mb-4">Agent Performance</h3>
              <div className="space-y-4">
                {stats.agentPerformance.map((agent: any) => (
                  <div key={agent.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold">{agent.name}</span>
                      <span className="text-slate-500">{agent.closed}/{agent.assigned} Closed</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${agent.efficiency}%` }}
                        className="h-full bg-blue-600"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Follow-up Reminders */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Clock size={18} className="text-amber-500" />
              <span>Pending Follow-ups</span>
            </h3>
            <div className="space-y-4">
              {[
                { name: 'Sarah Khan', date: 'Today, 2:00 PM', overdue: true },
                { name: 'John Miller', date: 'Tomorrow, 10:00 AM', overdue: false },
              ].map((reminder, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-l-4 border-amber-500">
                  <div>
                    <p className="text-sm font-bold">{reminder.name}</p>
                    <p className={`text-[10px] font-medium ${reminder.overdue ? 'text-red-500' : 'text-slate-500'}`}>
                      {reminder.date}
                    </p>
                  </div>
                  <button className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-blue-600">
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              ))}
              <button className="w-full py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all">
                View All Reminders
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-6 text-white shadow-xl shadow-blue-500/20">
            <h4 className="font-bold text-lg mb-2">Need Help?</h4>
            <p className="text-indigo-100 text-sm mb-6">Check our documentation for tips on lead scoring and assignment rules.</p>
            <button className="w-full py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl font-bold transition-all border border-white/20">
              View Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, trend }: any) {
  const colors: any = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
    indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${colors[color]}`}>
          <Icon size={24} />
        </div>
        <div className="flex items-center gap-1 text-[10px] font-bold text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg">
          <ArrowUpRight size={12} />
          {trend}
        </div>
      </div>
      <p className="text-sm text-slate-500 font-medium">{label}</p>
      <h3 className="text-2xl font-bold mt-1">{value}</h3>
    </motion.div>
  );
}
