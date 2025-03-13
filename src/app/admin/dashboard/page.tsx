"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// 동적 렌더링 설정
export const dynamic = "force-dynamic";
// 서버 사이드 렌더링 비활성화
export const unstable_noStore = true;
// Edge 런타임 사용
export const runtime = "edge";

export default function AdminDashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // 클라이언트 사이드에서만 useSession 사용
  const { data: session, status } = useSession();

  // 컴포넌트가 마운트되었는지 확인
  useEffect(() => {
    setMounted(true);
  }, []);

  // 로딩 중이거나 인증되지 않은 경우 처리
  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div
            className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-600 border-t-transparent"
            role="status"
          >
            <span className="sr-only">로딩 중...</span>
          </div>
          <p className="mt-2">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (mounted && status === "loading") {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div
            className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-600 border-t-transparent"
            role="status"
          >
            <span className="sr-only">로딩 중...</span>
          </div>
          <p className="mt-2">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (mounted && (status === "unauthenticated" || !session)) {
    router.push("/admin/login");
    return null;
  }

  // 관리자가 아닌 경우 접근 제한
  if (mounted && session?.user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">
            접근 권한이 없습니다
          </h1>
          <p className="mt-2">관리자만 접근할 수 있는 페이지입니다.</p>
          <Link
            href="/"
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">대시보드</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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

      <div>
        <h2 className="text-xl font-bold mb-4">바로가기</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/admin/banners"
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h3 className="font-bold text-gray-800 mb-2">배너 관리</h3>
            <p className="text-gray-600 text-sm">
              웹사이트 배너를 추가하고 관리합니다.
            </p>
          </Link>
          <Link
            href="/admin/media"
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h3 className="font-bold text-gray-800 mb-2">미디어 관리</h3>
            <p className="text-gray-600 text-sm">
              이미지와 비디오를 업로드하고 관리합니다.
            </p>
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="font-bold mb-2">최근 활동</h3>
        <div className="border rounded-lg">
          <div className="p-4 text-center text-gray-500">
            최근 활동 내역이 없습니다.
          </div>
        </div>
      </div>
    </div>
  );
}
