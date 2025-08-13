"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";

// 동적 렌더링 설정
export const dynamic = "force-dynamic";

// 클라이언트 사이드에서만 렌더링
export const runtime = "edge";

// 서버 사이드 렌더링 비활성화
export const unstable_noStore = true;

// 신청 정보 인터페이스 정의
interface Application {
  id: string;
  name: string;
  email: string;
  phone: string;
  courseId: string;
  courseName: string;
  status: "pending" | "approved" | "rejected";
  message: string;
  createdAt: string;
  updatedAt: string;
  koreanName: string;
  englishName?: string;
}

// 과정 인터페이스 정의
interface Course {
  id: string;
  title: string;
}

export default function AdminApplications() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // 클라이언트 사이드에서만 useSession 사용
  const { data: session, status } = useSession();

  // 컴포넌트가 마운트되었는지 확인
  useEffect(() => {
    setMounted(true);
  }, []);

  // 세션 체크
  useEffect(() => {
    if (mounted) {
      if (status === "unauthenticated") {
        signIn();
      } else if (session?.user?.role !== "admin") {
        router.push("/");
      }
    }
  }, [session, status, router, mounted]);

  // 신청 목록 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 신청 목록 가져오기
        const applicationsResponse = await fetch("/api/applications");
        if (!applicationsResponse.ok) {
          throw new Error("신청 목록을 불러오는데 실패했습니다.");
        }
        const applicationsData = await applicationsResponse.json();

        // 과정 정보 가져오기
        const coursesResponse = await fetch("/api/courses");
        if (!coursesResponse.ok) {
          throw new Error("과정 목록을 불러오는데 실패했습니다.");
        }
        const coursesData = await coursesResponse.json();

        // 과정 정보를 신청 정보에 포함
        const enrichedApplications = applicationsData.map((app: any) => {
          const course = coursesData.find((c: Course) => c.id === app.courseId);
          return {
            ...app,
            courseName: course ? course.title : "알 수 없는 과정",
          };
        });

        setApplications(enrichedApplications);
        setCourses(coursesData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    if (mounted && session?.user?.role === "admin") {
      fetchData();
    }
  }, [session, mounted]);

  // 신청 상태 변경 핸들러
  const handleStatusChange = async (
    id: string,
    newStatus: "approved" | "rejected"
  ) => {
    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("신청 상태 변경에 실패했습니다.");
      }

      setApplications(
        applications.map((app) =>
          app.id === id ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
    }
  };

  // 신청 삭제 핸들러
  const handleDelete = async (id: string) => {
    if (!confirm("정말로 이 신청을 삭제하시겠습니까?")) {
      return;
    }

    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("신청 삭제에 실패했습니다.");
      }

      // 목록에서 삭제된 항목 제거
      setApplications(applications.filter((app) => app.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">신청자 관리</h1>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-500">등록된 신청 내역이 없습니다.</p>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    신청자
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    이메일
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    연락처
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    신청 과정
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    상태
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    신청일
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    액션
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((application) => (
                  <tr key={application.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {application.koreanName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {application.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {application.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {application.courseName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          application.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : application.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {application.status === "approved"
                          ? "승인됨"
                          : application.status === "rejected"
                          ? "거절됨"
                          : "대기중"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(application.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        {application.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusChange(application.id, "approved")
                              }
                              className="text-green-600 hover:text-green-900"
                            >
                              승인
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(application.id, "rejected")
                              }
                              className="text-red-600 hover:text-red-900"
                            >
                              거절
                            </button>
                          </>
                        )}
                        <button
                          onClick={() =>
                            router.push(`/admin/applications/${application.id}`)
                          }
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          상세보기
                        </button>
                        <button
                          onClick={() => handleDelete(application.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
