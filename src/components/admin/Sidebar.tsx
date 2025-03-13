"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiUsers,
  FiSettings,
  FiBook,
  FiMenu,
  FiX,
  FiImage,
  FiFile,
} from "react-icons/fi";

interface MenuItem {
  name: string;
  href: string;
  icon: string;
}

interface AdminSidebarProps {
  menuItems: MenuItem[];
}

export default function AdminSidebar({ menuItems }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // 아이콘 매핑
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "dashboard":
        return <FiHome className="w-5 h-5" />;
      case "users":
        return <FiUsers className="w-5 h-5" />;
      case "settings":
        return <FiSettings className="w-5 h-5" />;
      case "school":
        return <FiBook className="w-5 h-5" />;
      case "image":
        return <FiImage className="w-5 h-5" />;
      case "file":
        return <FiFile className="w-5 h-5" />;
      default:
        return <FiHome className="w-5 h-5" />;
    }
  };

  return (
    <>
      {/* 모바일 토글 버튼 */}
      <div className="md:hidden fixed top-0 left-0 z-20 p-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-500 hover:text-gray-600 focus:outline-none"
        >
          {isOpen ? (
            <FiX className="w-6 h-6" />
          ) : (
            <FiMenu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* 사이드바 */}
      <div
        className={`bg-white shadow-lg fixed md:static inset-y-0 left-0 z-10 w-64 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* 로고 */}
          <div className="flex items-center justify-center h-16 bg-blue-600 text-white">
            <Link href="/admin" className="text-xl font-bold">
              관리자 대시보드
            </Link>
          </div>

          {/* 메뉴 */}
          <nav className="flex-1 px-2 py-4 bg-white space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  pathname === item.href
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <span className="mr-3">{getIcon(item.icon)}</span>
                {item.name}
              </Link>
            ))}
          </nav>

          {/* 푸터 */}
          <div className="p-4 border-t border-gray-200">
            <Link
              href="/"
              className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <FiHome className="mr-2 w-5 h-5" />
              홈페이지로 이동
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
