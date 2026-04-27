import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Shield, Users, Settings, AlertTriangle } from 'lucide-react';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // SIMPLE RBAC CHECK
  // If user is not an Admin, send them away!
  if ((session?.user as any)?.role !== 'Admin') {
    redirect('/dashboard');
  }

  return (
    <div className="space-y-6 p-8">
      <div className="bg-blue-600 rounded-3xl p-8 text-white flex items-center justify-between shadow-xl shadow-blue-500/20">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Shield size={32} />
            Admin Command Center
          </h1>
          <p className="text-blue-100 mt-2">Welcome, {session?.user?.name}. You have full administrative privileges.</p>
        </div>
        <div className="hidden md:block opacity-20">
          <Shield size={120} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AdminCard 
          title="User Management" 
          description="Manage agents, update roles, and monitor status."
          icon={Users}
        />
        <AdminCard 
          title="System Logs" 
          description="View all activity logs and audit trails."
          icon={Settings}
        />
        <AdminCard 
          title="Security Alerts" 
          description="Monitor login attempts and system stability."
          icon={AlertTriangle}
        />
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center">
        <p className="text-slate-500">This page is only visible because you are logged in as an <span className="font-bold text-blue-600">Admin</span>.</p>
      </div>
    </div>
  );
}

function AdminCard({ title, description, icon: Icon }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl hover:shadow-lg transition-all group">
      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 group-hover:bg-blue-500 group-hover:text-white transition-all mb-4">
        <Icon size={24} />
      </div>
      <h3 className="font-bold text-lg mb-1">{title}</h3>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
  );
}
