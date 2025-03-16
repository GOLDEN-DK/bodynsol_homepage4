import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 현재 URL 경로
  const path = request.nextUrl.pathname;

  // 관리자 로그인 페이지는 그대로 접근 허용
  if (path === "/admin/login") {
    return NextResponse.next();
  }

  // 나머지 관리자 페이지는 세션 체크를 통해 레이아웃에서 처리
  return NextResponse.next();
}

// 미들웨어가 적용될 경로 설정
export const config = {
  matcher: ["/admin/:path*"],
};
