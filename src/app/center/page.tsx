"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CenterPage() {
  const router = useRouter();

  // 센터 메인 페이지에 접속하면 브랜드소개 페이지로 리다이렉트
  useEffect(() => {
    router.push("/center/brand");
  }, [router]);

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <p className="text-gray-500">리다이렉트 중...</p>
    </div>
  );
}
