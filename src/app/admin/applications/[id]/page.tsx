"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
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
  age?: number;
  gender?: string;
  region?: string;
  price?: number;
  discountedPrice?: number;
}

export default function ApplicationDetail() {
  const router = useRouter();
  const params = useParams();
  const id =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
      ? params.id[0]
      : "";

  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  // 신청 정보 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 신청 정보 가져오기
        const applicationResponse = await fetch(`/api/applications/${id}`);
        if (!applicationResponse.ok) {
          throw new Error("신청 정보를 불러오는데 실패했습니다.");
        }
        const applicationData = await applicationResponse.json();

        // 과정 정보 가져오기
        const courseResponse = await fetch(
          `/api/courses/${applicationData.courseId}`
        );
        if (!courseResponse.ok) {
          throw new Error("과정 정보를 불러오는데 실패했습니다.");
        }
        const courseData = await courseResponse.json();

        // 과정 정보를 신청 정보에 포함
        setApplication({
          ...applicationData,
          courseName: courseData.title,
          price: courseData.price || undefined,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    if (mounted && session?.user?.role === "admin" && id) {
      fetchData();
    }
  }, [session, mounted, id]);

  // 신청 상태 변경 핸들러
  const handleStatusChange = async (newStatus: "approved" | "rejected") => {
    if (!application) return;

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

      setApplication({
        ...application,
        status: newStatus,
      });
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

  if (!application) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>신청 정보를 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">신청 상세 정보</h1>
        <button
          onClick={() => router.push("/admin/applications")}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium"
        >
          목록으로 돌아가기
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">신청자 정보</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">신청자명</p>
              <p className="text-sm text-gray-700">{application.koreanName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                영문 이름
              </p>
              <p className="text-sm text-gray-700">
                {application.englishName || "-"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">이메일</p>
              <p className="text-sm text-gray-700">{application.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">연락처</p>
              <p className="text-sm text-gray-700">{application.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">나이</p>
              <p className="text-sm text-gray-700">
                {application.age ? `${application.age}세` : "-"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">성별</p>
              <p className="text-sm text-gray-700">
                {application.gender || "-"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">지역</p>
              <p className="text-sm text-gray-700">
                {application.region || "-"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">신청일</p>
              <p className="text-sm text-gray-700">
                {formatDate(application.createdAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-b border-gray-200 px-6 py-4 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">
            신청 과정 정보
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">과정명</p>
              <p className="text-sm text-gray-700">{application.courseName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">상태</p>
              <p className="mt-1">
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
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                원래 교육비
              </p>
              <p className="text-sm text-gray-700">
                {application.price
                  ? `${application.price.toLocaleString()}원`
                  : "-"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                할인된 교육비
              </p>
              <p className="text-sm text-gray-700">
                {application.discountedPrice ? (
                  <>
                    <span
                      className={`${
                        application.price &&
                        application.discountedPrice < application.price
                          ? "line-through text-gray-400 mr-2"
                          : ""
                      }`}
                    >
                      {application.price
                        ? `${application.price.toLocaleString()}원`
                        : ""}
                    </span>
                    <span className="font-medium text-blue-600">
                      {`${application.discountedPrice.toLocaleString()}원`}
                    </span>
                    {application.price &&
                      application.discountedPrice < application.price && (
                        <span className="ml-2 text-xs text-green-600 font-medium">
                          (
                          {Math.round(
                            (1 -
                              application.discountedPrice / application.price) *
                              100
                          )}
                          % 할인)
                        </span>
                      )}
                  </>
                ) : application.price ? (
                  `${application.price.toLocaleString()}원`
                ) : (
                  "-"
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">메시지</h2>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-700 whitespace-pre-wrap">
            {application.message || "메시지 없음"}
          </p>
        </div>

        {application.status === "pending" && (
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label
                    htmlFor="discountedPrice"
                    className="block text-sm font-medium text-gray-900 mb-1"
                  >
                    할인 금액 설정
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      id="discountedPrice"
                      placeholder="할인된 금액 입력"
                      defaultValue={application.discountedPrice}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value) && value > 0) {
                          setApplication({
                            ...application,
                            discountedPrice: value,
                          });
                        }
                      }}
                    />
                    <button
                      className="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                      onClick={async () => {
                        try {
                          const response = await fetch(
                            `/api/applications/${id}`,
                            {
                              method: "PATCH",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({
                                discountedPrice: application.discountedPrice,
                              }),
                            }
                          );

                          if (!response.ok) {
                            throw new Error("할인 금액 설정에 실패했습니다.");
                          }

                          setSuccessMessage(
                            "할인 금액이 성공적으로 저장되었습니다."
                          );
                          setTimeout(() => setSuccessMessage(null), 3000);
                        } catch (err) {
                          setError(
                            err instanceof Error
                              ? err.message
                              : "알 수 없는 오류가 발생했습니다."
                          );
                        }
                      }}
                    >
                      저장
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleStatusChange("approved")}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  신청 승인
                </button>
                <button
                  onClick={() => handleStatusChange("rejected")}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  신청 거절
                </button>
              </div>
              {successMessage && (
                <div className="mt-2 text-sm text-green-600">
                  {successMessage}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
