'use client';

import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import AdminSidebar from '@/components/admin/Sidebar';
import AdminHeader from '@/components/admin/Header';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-gray-100">
        <AdminHeader />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row">
            <AdminSidebar />
            <div className="flex-1 bg-white shadow rounded-lg">
              {children}
            </div>
          </div>
        </div>
      </div>
    </SessionProvider>
  );
} 