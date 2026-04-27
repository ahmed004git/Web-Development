'use client';

import { useSession, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import { LogOut, User, Shield, Briefcase, Activity, ChevronRight, Bell, Search } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                MA
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                PropertyCRM
              </span>
            </div>

            <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2 w-96">
              <Search size={18} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Search leads, properties..." 
                className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full"
              />
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
              </button>
              
              <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
              
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{session?.user?.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{(session?.user as any)?.role || 'Agent'}</p>
                </div>
                <button 
                  onClick={() => signOut()}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-400 rounded-xl transition-all font-medium text-sm"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold text-slate-900 dark:text-white"
          >
            Dashboard Overview
          </motion.h1>
          <p className="text-slate-500 dark:text-slate-400">Welcome back, {session?.user?.name}! Here's what's happening today.</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Leads', value: '1,284', icon: User, color: 'blue', trend: '+12.5%' },
            { label: 'Active Deals', value: '43', icon: Briefcase, color: 'indigo', trend: '+5.2%' },
            { label: 'Conversion Rate', value: '24.8%', icon: Activity, color: 'green', trend: '+2.1%' },
            { label: 'Admin Status', value: (session?.user as any)?.role === 'Admin' ? 'Active' : 'N/A', icon: Shield, color: 'purple', trend: 'Secure' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20 text-${stat.color}-600 dark:text-${stat.color}-400`}>
                  <stat.icon size={24} />
                </div>
                <span className="text-xs font-bold text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg">
                  {stat.trend}
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</h3>
            </motion.div>
          ))}
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Recent Activity</h3>
                <button className="text-blue-600 text-sm font-semibold hover:underline">View All</button>
              </div>
              <div className="p-0">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="p-4 flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                      <User size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">New Lead Assigned</p>
                      <p className="text-xs text-slate-500">Sarah Johnson was assigned to you for Property #124</p>
                    </div>
                    <span className="text-xs text-slate-400">2h ago</span>
                    <ChevronRight size={16} className="text-slate-300" />
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-lg shadow-blue-500/20">
              <h3 className="font-bold text-xl mb-2">Pro Feature Available</h3>
              <p className="text-blue-100 text-sm mb-6">Upgrade your account to access advanced analytics and lead generation tools.</p>
              <button className="w-full py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-sm">
                Upgrade Now
              </button>
            </section>
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-slate-200 dark:border-slate-800 mt-8 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-slate-200 dark:bg-slate-800 rounded flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-400">
            MA
          </div>
          <span>&copy; 2024 PropertyCRM. All rights reserved.</span>
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-blue-600">Privacy Policy</a>
          <a href="#" className="hover:text-blue-600">Terms of Service</a>
          <a href="#" className="hover:text-blue-600">Contact Support</a>
        </div>
      </footer>
    </div>
  );
}
