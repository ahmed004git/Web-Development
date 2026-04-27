'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User as UserIcon, Loader2, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { signup } from '@/app/actions/auth';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['Admin', 'Agent']).default('Agent'),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [error, setError] = useState<Record<string, string[]> | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: 'Agent',
    }
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('role', data.role);

    try {
      const result = await signup(null, formData);

      if (result?.error) {
        setError(result.error as any);
      } else if (result?.success) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (err) {
      setError({ message: ['An unexpected error occurred. Please try again.'] } as any);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-slate-900 shadow-2xl rounded-3xl p-10 text-center border border-slate-200 dark:border-slate-800"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Account Created!</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Your account has been successfully created. Redirecting to login...
        </p>
        <div className="mt-8 flex justify-center">
          <Loader2 className="animate-spin text-blue-600" size={24} />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-slate-900 shadow-2xl rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800"
    >
      <div className="p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white mb-4 shadow-lg shadow-blue-500/20">
            <UserPlus size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Create Account</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Join us and start managing your leads</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm"
          >
            <div className="flex items-center gap-3 mb-1 font-semibold">
              <AlertCircle size={18} />
              <span>Registration Failed</span>
            </div>
            <ul className="list-disc list-inside ml-7">
              {Object.entries(error).map(([key, messages]) => (
                <li key={key}>{Array.isArray(messages) ? messages[0] : (messages as any)}</li>
              ))}
            </ul>
          </motion.div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Full Name</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                <UserIcon size={18} />
              </div>
              <input
                {...register('name')}
                type="text"
                className={`w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border ${
                  errors.name ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:text-white`}
                placeholder="John Doe"
              />
            </div>
            {errors.name && <p className="text-xs text-red-500 ml-1 mt-1">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                <Mail size={18} />
              </div>
              <input
                {...register('email')}
                type="email"
                className={`w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border ${
                  errors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:text-white`}
                placeholder="name@example.com"
              />
            </div>
            {errors.email && <p className="text-xs text-red-500 ml-1 mt-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                <Lock size={18} />
              </div>
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                className={`w-full pl-11 pr-11 py-3 bg-slate-50 dark:bg-slate-800/50 border ${
                  errors.password ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:text-white`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 ml-1 mt-1">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">I am a...</label>
            <div className="grid grid-cols-2 gap-3">
              <label className={`
                flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-all
                ${register('role').value === 'Agent' ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-500/20' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}
              `}>
                <input {...register('role')} type="radio" value="Agent" className="sr-only" />
                <span className="font-medium">Agent</span>
              </label>
              <label className={`
                flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-all
                ${register('role').value === 'Admin' ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-500/20' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}
              `}>
                <input {...register('role')} type="radio" value="Admin" className="sr-only" />
                <span className="font-medium">Admin</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/70 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 active:scale-[0.98] mt-4"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <span>Create Account</span>
                <UserPlus size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-600 dark:text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-blue-600 hover:text-blue-500 transition-colors">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
