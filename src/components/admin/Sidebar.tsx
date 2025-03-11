'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminSidebar() {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };
  
  return (
    <div className="w-full md:w-64 bg-white shadow rounded-lg p-4 mb-6 md:mr-6">
      <h2 className="text-lg font-bold mb-4 text-gray-800">관리자 메뉴</h2>
      <nav className="space-y-1">
        <Link
          href="/admin/dashboard"
          className={`block px-3 py-2 rounded-md text-sm font-medium ${
            isActive('/admin/dashboard')
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          대시보드
        </Link>
        <Link
          href="/admin/banners"
          className={`block px-3 py-2 rounded-md text-sm font-medium ${
            isActive('/admin/banners')
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          배너 관리
        </Link>
        <Link
          href="/admin/media"
          className={`block px-3 py-2 rounded-md text-sm font-medium ${
            isActive('/admin/media')
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          미디어 관리
        </Link>
      </nav>
    </div>
  );
} 