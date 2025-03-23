"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// 클라이언트 사이드에서만 렌더링되도록 설정
export const dynamic = "force-dynamic";
export const runtime = "edge";

export default function NewTeacher() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 폼 데이터 관리
  const [teacherData, setTeacherData] = useState({
    name: "",
    bio: "",
    experience: "",
    certifications: "",
    profileImage: "",
    isActive: true,
  });

  // 세션 체크
  useEffect(() => {
    if (status === "unauthenticated") {
      signIn();
    } else if (session?.user?.role !== "admin") {
      router.push("/");
    }
  }, [session, status, router]);

  // 입력값 변경 핸들러
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setTeacherData({
      ...teacherData,
      [name]: type === "checkbox" 
        ? (e.target as HTMLInputElement).checked 
        : value,
    });
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/teachers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(teacherData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "강사 생성에 실패했습니다.");
      }

      // 성공하면 목록 페이지로 이동
      router.push("/admin/teachers");
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">강사 추가</h1>
        <Link
          href="/admin/teachers"
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          뒤로 가기
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 이름 */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={teacherData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            />
          </div>

          {/* 강사 소개 */}
          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              강사 소개
            </label>
            <textarea
              id="bio"
              name="bio"
              value={teacherData.bio}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            ></textarea>
          </div>

          {/* 경력사항 */}
          <div>
            <label
              htmlFor="experience"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              경력사항
            </label>
            <textarea
              id="experience"
              name="experience"
              value={teacherData.experience}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            ></textarea>
            <p className="mt-1 text-sm text-gray-500">
              각 항목을 줄바꿈으로 구분하여 입력하세요.
            </p>
          </div>

          {/* 자격증 */}
          <div>
            <label
              htmlFor="certifications"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              자격증
            </label>
            <textarea
              id="certifications"
              name="certifications"
              value={teacherData.certifications}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            ></textarea>
            <p className="mt-1 text-sm text-gray-500">
              각 항목을 줄바꿈으로 구분하여 입력하세요.
            </p>
          </div>

          {/* 프로필 이미지 URL */}
          <div>
            <label
              htmlFor="profileImage"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              프로필 이미지 URL
            </label>
            <input
              type="text"
              id="profileImage"
              name="profileImage"
              value={teacherData.profileImage}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            />
            <p className="mt-1 text-sm text-gray-500">
              이미지 업로드는 추후 추가될 예정입니다. 현재는 이미지 URL을 직접 입력해주세요.
            </p>
          </div>

          {/* 활성화 상태 */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={teacherData.isActive}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="isActive"
              className="ml-2 block text-sm font-medium text-gray-700"
            >
              활성화
            </label>
          </div>

          {/* 저장 버튼 */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "저장 중..." : "저장"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 