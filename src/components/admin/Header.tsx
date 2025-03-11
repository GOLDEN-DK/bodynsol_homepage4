'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function AdminHeader() {
  const { data: session } = useSession();
  
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/admin/dashboard" className="text-2xl font-bold text-gray-900">
          바디앤솔 관리자
        </Link>
        {session?.user && (
          <div className="flex items-center">
            <span className="mr-4 text-sm text-gray-600">
              {session.user.email}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="text-sm text-red-600 hover:text-red-800"
            >
              로그아웃
            </button>
          </div>
        )}
      </div>
    </header>
  );
} 