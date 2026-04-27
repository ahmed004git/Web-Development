'use client';

import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, 
  User, 
  Shield, 
  Briefcase, 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  Bell, 
  Search,
  Menu,
  X,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { label: 'Overview', icon: LayoutDashboard, href: '/dashboard', roles: ['Admin', 'Agent'] },
    { label: 'Leads', icon: Users, href: '/dashboard/leads', roles: ['Admin', 'Agent'] },
    { label: 'Reports', icon: FileText, href: '/dashboard/reports', roles: ['Admin'] },
    { label: 'Settings', icon: Settings, href: '/dashboard/settings', roles: ['Admin', 'Agent'] },
  ];

  const filteredMenu = menuItems.filter(item => 
    item.roles.includes((session?.user as any)?.role || 'Agent')
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex">
      {/* Sidebar */}
      <aside className={`
        ${isSidebarOpen ? 'w-64' : 'w-20'} 
        bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col z-50
      `}>
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">MA</div>
              <span className="font-bold text-xl tracking-tight">PropertyCRM</span>
            </div>
          ) : (
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg mx-auto">MA</div>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {filteredMenu.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`
                  flex items-center gap-3 p-3 rounded-xl transition-all
                  ${isActive 
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-semibold' 
                    : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'}
                `}
              >
                <item.icon size={22} />
                {isSidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button 
            onClick={() => signOut()}
            className="flex items-center gap-3 p-3 w-full rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
          >
            <LogOut size={22} />
            {isSidebarOpen && <span className="font-semibold">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between">
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2 w-64">
              <Search size={18} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full"
              />
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-400 hover:text-blue-600 relative">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold">{session?.user?.name}</p>
                  <p className="text-xs text-slate-500 capitalize">{(session?.user as any)?.role}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-blue-500/20 flex items-center justify-center">
                  <User size={20} className="text-slate-500" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
