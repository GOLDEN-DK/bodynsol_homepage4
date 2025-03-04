'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? 'text-[#b5b67d] font-bold' : 'text-gray-700 hover:text-[#b5b67d]';
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Image 
                src="/logo.png" 
                alt="바디앤솔 로고" 
                width={60} 
                height={60} 
                className="mr-3"
              />
              <span className="text-xl font-bold text-[#8a7e71]">바디앤솔</span>
            </Link>
          </div>

          {/* 데스크탑 메뉴 */}
          <nav className="hidden md:ml-6 md:flex md:space-x-8">
            <Link href="/" className={`inline-flex items-center px-1 pt-1 border-b-2 ${pathname === '/' ? 'border-[#b5b67d]' : 'border-transparent'} ${isActive('/')}`}>
              홈
            </Link>
            <Link href="/center" className={`inline-flex items-center px-1 pt-1 border-b-2 ${pathname === '/center' ? 'border-[#b5b67d]' : 'border-transparent'} ${isActive('/center')}`}>
              센터
            </Link>
            <Link href="/academy" className={`inline-flex items-center px-1 pt-1 border-b-2 ${pathname === '/academy' ? 'border-[#b5b67d]' : 'border-transparent'} ${isActive('/academy')}`}>
              아카데미
            </Link>
            <Link href="/courses" className={`inline-flex items-center px-1 pt-1 border-b-2 ${pathname === '/courses' ? 'border-[#b5b67d]' : 'border-transparent'} ${isActive('/courses')}`}>
              교육과정
            </Link>
            <Link href="/community" className={`inline-flex items-center px-1 pt-1 border-b-2 ${pathname === '/community' ? 'border-[#b5b67d]' : 'border-transparent'} ${isActive('/community')}`}>
              커뮤니티
            </Link>
            <Link href="/contact" className={`inline-flex items-center px-1 pt-1 border-b-2 ${pathname === '/contact' ? 'border-[#b5b67d]' : 'border-transparent'} ${isActive('/contact')}`}>
              상담/문의
            </Link>
          </nav>

          {/* 모바일 메뉴 버튼 */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">메뉴 열기</span>
              {/* 햄버거 아이콘 */}
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* X 아이콘 */}
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link href="/" className={`block pl-3 pr-4 py-2 border-l-4 ${pathname === '/' ? 'border-[#b5b67d] bg-[#f5f6e4] text-[#8a7e71]' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-[#8a7e71]'}`}>
            홈
          </Link>
          <Link href="/center" className={`block pl-3 pr-4 py-2 border-l-4 ${pathname === '/center' ? 'border-[#b5b67d] bg-[#f5f6e4] text-[#8a7e71]' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-[#8a7e71]'}`}>
            센터
          </Link>
          <Link href="/academy" className={`block pl-3 pr-4 py-2 border-l-4 ${pathname === '/academy' ? 'border-[#b5b67d] bg-[#f5f6e4] text-[#8a7e71]' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-[#8a7e71]'}`}>
            아카데미
          </Link>
          <Link href="/courses" className={`block pl-3 pr-4 py-2 border-l-4 ${pathname === '/courses' ? 'border-[#b5b67d] bg-[#f5f6e4] text-[#8a7e71]' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-[#8a7e71]'}`}>
            교육과정
          </Link>
          <Link href="/community" className={`block pl-3 pr-4 py-2 border-l-4 ${pathname === '/community' ? 'border-[#b5b67d] bg-[#f5f6e4] text-[#8a7e71]' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-[#8a7e71]'}`}>
            커뮤니티
          </Link>
          <Link href="/contact" className={`block pl-3 pr-4 py-2 border-l-4 ${pathname === '/contact' ? 'border-[#b5b67d] bg-[#f5f6e4] text-[#8a7e71]' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-[#8a7e71]'}`}>
            상담/문의
          </Link>
        </div>
      </div>
    </header>
  );
} 