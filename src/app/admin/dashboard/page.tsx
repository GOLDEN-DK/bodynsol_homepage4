'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  // 로딩 중이거나 인증되지 않은 경우 처리
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-600 border-t-transparent" role="status">
            <span className="sr-only">로딩 중...</span>
          </div>
          <p className="mt-2">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated' || !session) {
    router.push('/admin/login');
    return null;
  }

  // 관리자가 아닌 경우 접근 제한
  if (session.user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">접근 권한이 없습니다</h1>
          <p className="mt-2">관리자만 접근할 수 있는 페이지입니다.</p>
          <Link href="/" className="mt-4 inline-block text-blue-600 hover:underline">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 관리자 헤더 */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">바디앤솔 관리자</h1>
          <div className="flex items-center">
            <span className="mr-4 text-sm text-gray-600">
              {session.user.email}
            </span>
            <button
              onClick={() => router.push('/api/auth/signout')}
              className="text-sm text-red-600 hover:text-red-800"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row">
          {/* 사이드바 */}
          <div className="w-full md:w-64 bg-white shadow rounded-lg p-4 mb-6 md:mr-6">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'overview'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                대시보드
              </button>
              <button
                onClick={() => setActiveTab('banners')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'banners'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                배너 관리
              </button>
              <button
                onClick={() => setActiveTab('courses')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'courses'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                교육과정 관리
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'events'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                이벤트 관리
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'reviews'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                후기 관리
              </button>
              <button
                onClick={() => setActiveTab('contacts')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'contacts'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                문의 관리
              </button>
              <button
                onClick={() => setActiveTab('media')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'media'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                미디어 관리
              </button>
            </nav>
          </div>

          {/* 메인 콘텐츠 */}
          <div className="flex-1 bg-white shadow rounded-lg p-6">
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-xl font-bold mb-4">대시보드</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-bold text-blue-700">교육과정</h3>
                    <p className="text-2xl font-bold">0개</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-bold text-green-700">이벤트</h3>
                    <p className="text-2xl font-bold">0개</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="font-bold text-yellow-700">미답변 문의</h3>
                    <p className="text-2xl font-bold">0개</p>
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="font-bold mb-2">최근 활동</h3>
                  <div className="border rounded-lg">
                    <div className="p-4 text-center text-gray-500">
                      최근 활동 내역이 없습니다.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'banners' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">배너 관리</h2>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm">
                    새 배너 추가
                  </button>
                </div>
                <div className="border rounded-lg">
                  <div className="p-4 text-center text-gray-500">
                    등록된 배너가 없습니다.
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'courses' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">교육과정 관리</h2>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm">
                    새 교육과정 추가
                  </button>
                </div>
                <div className="border rounded-lg">
                  <div className="p-4 text-center text-gray-500">
                    등록된 교육과정이 없습니다.
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'events' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">이벤트 관리</h2>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm">
                    새 이벤트 추가
                  </button>
                </div>
                <div className="border rounded-lg">
                  <div className="p-4 text-center text-gray-500">
                    등록된 이벤트가 없습니다.
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">후기 관리</h2>
                </div>
                <div className="border rounded-lg">
                  <div className="p-4 text-center text-gray-500">
                    등록된 후기가 없습니다.
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contacts' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">문의 관리</h2>
                </div>
                <div className="border rounded-lg">
                  <div className="p-4 text-center text-gray-500">
                    등록된 문의가 없습니다.
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'media' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">미디어 관리</h2>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm">
                    새 미디어 업로드
                  </button>
                </div>
                <div className="border rounded-lg">
                  <div className="p-4 text-center text-gray-500">
                    등록된 미디어가 없습니다.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 