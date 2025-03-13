"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  FiUsers,
  FiBook,
  FiSettings,
  FiCalendar,
  FiImage,
} from "react-icons/fi";

// 동적 렌더링 설정
export const dynamic = "force-dynamic";
// 서버 사이드 렌더링 비활성화
export const unstable_noStore = true;
// Edge 런타임 사용
export const runtime = "edge";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCourses: 0,
    activeCourses: 0,
    totalUsers: 0,
    totalEnrollments: 0,
  });
  const [mounted, setMounted] = useState(false);

  // 클라이언트 사이드에서만 useSession 사용
  const { data: session } = useSession();

  // 컴포넌트가 마운트되었는지 확인
  useEffect(() => {
    setMounted(true);
  }, []);

  // 통계 데이터 가져오기
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 실제 API 연동 시 아래 주석 해제
        // const response = await fetch('/api/admin/stats');
        // const data = await response.json();
        // setStats(data);

        // 임시 데이터
        setStats({
          totalCourses: 12,
          activeCourses: 8,
          totalUsers: 156,
          totalEnrollments: 89,
        });
      } catch (error) {
        console.error("통계 데이터를 가져오는데 실패했습니다.", error);
      }
    };

    if (mounted) {
      fetchStats();
    }
  }, [mounted]);

  if (!mounted) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
        <p className="text-gray-600">
          안녕하세요, {session?.user?.name || "관리자"}님! 오늘도 좋은 하루
          되세요.
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FiBook className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">전체 과정</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalCourses}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Link
              href="/admin/courses"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              과정 관리하기 &rarr;
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FiBook className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">활성 과정</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.activeCourses}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Link
              href="/admin/courses"
              className="text-sm text-green-600 hover:text-green-800 font-medium"
            >
              활성 과정 보기 &rarr;
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <FiUsers className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">전체 사용자</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalUsers}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Link
              href="/admin/users"
              className="text-sm text-purple-600 hover:text-purple-800 font-medium"
            >
              사용자 관리하기 &rarr;
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <FiCalendar className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">총 수강 신청</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalEnrollments}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Link
              href="/admin/enrollments"
              className="text-sm text-yellow-600 hover:text-yellow-800 font-medium"
            >
              수강 신청 관리하기 &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* 빠른 액션 */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">빠른 액션</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/banners"
            className="flex items-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100"
          >
            <FiImage className="h-6 w-6 text-indigo-600" />
            <span className="ml-3 text-indigo-600 font-medium">배너 관리</span>
          </Link>
          <Link
            href="/admin/courses/new"
            className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100"
          >
            <FiBook className="h-6 w-6 text-blue-600" />
            <span className="ml-3 text-blue-600 font-medium">새 과정 추가</span>
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100"
          >
            <FiUsers className="h-6 w-6 text-purple-600" />
            <span className="ml-3 text-purple-600 font-medium">
              사용자 관리
            </span>
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
          >
            <FiSettings className="h-6 w-6 text-gray-600" />
            <span className="ml-3 text-gray-600 font-medium">사이트 설정</span>
          </Link>
        </div>
      </div>

      {/* 최근 활동 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">최근 활동</h2>
        </div>
        <div className="divide-y divide-gray-200">
          <div className="px-6 py-4">
            <p className="text-gray-500 text-sm">아직 활동 내역이 없습니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
