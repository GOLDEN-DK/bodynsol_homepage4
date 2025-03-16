"use client";

import { ReactNode } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/Header";

// 동적 렌더링 설정
export const dynamic = "force-dynamic";

const adminMenuItems = [
  { name: "대시보드", href: "/admin", icon: "dashboard" },
  { name: "배너 관리", href: "/admin/banners", icon: "image" },
  { name: "과정 관리", href: "/admin/courses", icon: "school" },
  { name: "사용자 관리", href: "/admin/users", icon: "users" },
  { name: "설정", href: "/admin/settings", icon: "settings" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // 로그인 페이지인 경우 인증 검사를 건너뜁니다
  const isLoginPage = pathname === "/admin/login";

  // 로딩 중이면 로딩 UI 표시
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // 로그인 페이지가 아니고, 인증되지 않았거나 관리자가 아니면 접근 불가
  if (
    !isLoginPage &&
    (status === "unauthenticated" || session?.user?.role !== "admin")
  ) {
    router.push("/admin/login");
    return null;
  }

  // 로그인 페이지인 경우 사이드바 없이 컨텐츠만 표시
  if (isLoginPage) {
    return <div className="min-h-screen bg-gray-100">{children}</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar menuItems={adminMenuItems} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto bg-gray-100">{children}</main>
      </div>
    </div>
  );
}
