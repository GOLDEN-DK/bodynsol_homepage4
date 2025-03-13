"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";

// 클라이언트 사이드에서만 로드되도록 에디터를 동적으로 임포트
const RichTextEditor = dynamic(
  () => import("@/components/editor/RichTextEditor"),
  {
    ssr: false,
  }
);

// 결제 방법 옵션
const PAYMENT_METHODS = [
  { id: "onsite", label: "현장결제" },
  { id: "card", label: "신용카드" },
  { id: "transfer", label: "계좌이체" },
];

export default function EditCourse() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // 과정 정보 상태
  const [courseData, setCourseData] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    thumbnailUrl: "",
    thumbnailWidth: 800,
    thumbnailHeight: 600,
    category: "",
    instructor: "",
    instructorInfo: "",
    instructorImageUrl: "",
    schedule: "",
    duration: "",
    location: "",
    maxStudents: "",
    price: "",
    discountPrice: "",
    paymentMethods: [] as string[],
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

  // 과정 정보 가져오기
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${courseId}`);
        if (!response.ok) {
          throw new Error("과정 정보를 가져오는데 실패했습니다.");
        }
        const data = await response.json();

        // 데이터 형식 변환
        setCourseData({
          title: data.title,
          slug: data.slug,
          description: data.description,
          content: data.content,
          thumbnailUrl: data.thumbnailUrl,
          thumbnailWidth: data.thumbnailWidth,
          thumbnailHeight: data.thumbnailHeight,
          category: data.category,
          instructor: data.instructor,
          instructorInfo: data.instructorInfo || "",
          instructorImageUrl: data.instructorImageUrl || "",
          schedule: data.schedule || "",
          duration: data.duration || "",
          location: data.location || "",
          maxStudents: data.maxStudents?.toString() || "",
          price: data.price?.toString() || "",
          discountPrice: data.discountPrice?.toString() || "",
          paymentMethods: data.paymentMethods || [],
          isActive: data.isActive,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.role === "admin" && courseId) {
      fetchCourse();
    }
  }, [session, courseId]);

  // 입력 변경 핸들러
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setCourseData({
      ...courseData,
      [name]: value,
    });
  };

  // 체크박스 변경 핸들러
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setCourseData({
      ...courseData,
      [name]: checked,
    });
  };

  // 결제 방법 변경 핸들러
  const handlePaymentMethodChange = (method: string) => {
    if (courseData.paymentMethods.includes(method)) {
      setCourseData({
        ...courseData,
        paymentMethods: courseData.paymentMethods.filter((m) => m !== method),
      });
    } else {
      setCourseData({
        ...courseData,
        paymentMethods: [...courseData.paymentMethods, method],
      });
    }
  };

  // 에디터 내용 변경 핸들러
  const handleContentChange = (html: string) => {
    setCourseData({
      ...courseData,
      content: html,
    });
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // 필수 필드 검증
      if (
        !courseData.title ||
        !courseData.slug ||
        !courseData.description ||
        !courseData.content ||
        !courseData.thumbnailUrl ||
        !courseData.category ||
        !courseData.instructor
      ) {
        throw new Error("필수 항목을 모두 입력해주세요.");
      }

      // 숫자 필드 변환
      const formattedData = {
        ...courseData,
        thumbnailWidth: parseInt(courseData.thumbnailWidth.toString()),
        thumbnailHeight: parseInt(courseData.thumbnailHeight.toString()),
        maxStudents: courseData.maxStudents
          ? parseInt(courseData.maxStudents)
          : null,
        price: courseData.price ? parseInt(courseData.price) : null,
        discountPrice: courseData.discountPrice
          ? parseInt(courseData.discountPrice)
          : null,
      };

      // API 요청
      const response = await fetch(`/api/courses/${courseId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "과정 수정에 실패했습니다.");
      }

      setSuccess(true);
      // 3초 후 과정 목록 페이지로 이동
      setTimeout(() => {
        router.push("/admin/courses");
      }, 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
    } finally {
      setSubmitting(false);
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">과정 수정</h1>
        <Link
          href="/admin/courses"
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          목록으로 돌아가기
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          <p>
            과정이 성공적으로 수정되었습니다. 잠시 후 목록 페이지로 이동합니다.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 기본 정보 */}
          <div className="space-y-4 md:col-span-2">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
              기본 정보
            </h2>

            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                과정명 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={courseData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="slug"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                URL 슬러그 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={courseData.slug}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                URL에 사용될 고유 식별자입니다. 영문, 숫자, 하이픈(-)만 사용
                가능합니다.
              </p>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                간단한 소개 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={courseData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              ></textarea>
            </div>

            <div>
              <label
                htmlFor="thumbnailUrl"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                썸네일 이미지 URL <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="thumbnailUrl"
                name="thumbnailUrl"
                value={courseData.thumbnailUrl}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                카테고리 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={courseData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* 강사 정보 */}
          <div className="space-y-4 md:col-span-2">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
              강사 정보
            </h2>

            <div>
              <label
                htmlFor="instructor"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                강사 이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="instructor"
                name="instructor"
                value={courseData.instructor}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="instructorInfo"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                강사 소개
              </label>
              <textarea
                id="instructorInfo"
                name="instructorInfo"
                value={courseData.instructorInfo}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>

            <div>
              <label
                htmlFor="instructorImageUrl"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                강사 이미지 URL
              </label>
              <input
                type="text"
                id="instructorImageUrl"
                name="instructorImageUrl"
                value={courseData.instructorImageUrl}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* 일정 및 장소 */}
          <div className="space-y-4 md:col-span-2">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
              일정 및 장소
            </h2>

            <div>
              <label
                htmlFor="schedule"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                일정 정보
              </label>
              <input
                type="text"
                id="schedule"
                name="schedule"
                value={courseData.schedule}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="예: 매주 월/수/금 19:00-21:00"
              />
            </div>

            <div>
              <label
                htmlFor="duration"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                과정 기간
              </label>
              <input
                type="text"
                id="duration"
                name="duration"
                value={courseData.duration}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="예: 8주 과정 (총 24시간)"
              />
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                교육 장소
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={courseData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="예: 바디앤솔 아카데미 강남점 3층 세미나실"
              />
            </div>

            <div>
              <label
                htmlFor="maxStudents"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                최대 수강 인원
              </label>
              <input
                type="number"
                id="maxStudents"
                name="maxStudents"
                value={courseData.maxStudents}
                onChange={handleInputChange}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* 가격 및 결제 정보 */}
          <div className="space-y-4 md:col-span-2">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
              가격 및 결제 정보
            </h2>

            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                가격 (원)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={courseData.price}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="discountPrice"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                할인 가격 (원)
              </label>
              <input
                type="number"
                id="discountPrice"
                name="discountPrice"
                value={courseData.discountPrice}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                결제 방법
              </label>
              <div className="space-y-2">
                {PAYMENT_METHODS.map((method) => (
                  <div key={method.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`payment-${method.id}`}
                      checked={courseData.paymentMethods.includes(method.id)}
                      onChange={() => handlePaymentMethodChange(method.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`payment-${method.id}`}
                      className="ml-2 block text-sm text-gray-700"
                    >
                      {method.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 상세 내용 */}
          <div className="space-y-4 md:col-span-2">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
              상세 내용
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                과정 상세 내용 <span className="text-red-500">*</span>
              </label>
              <RichTextEditor
                content={courseData.content}
                onChange={handleContentChange}
                placeholder="과정에 대한 상세 내용을 입력하세요..."
              />
            </div>
          </div>

          {/* 활성화 여부 */}
          <div className="md:col-span-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={courseData.isActive}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="isActive"
                className="ml-2 block text-sm text-gray-700"
              >
                과정 활성화 (체크 해제 시 비공개)
              </label>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={() => router.push("/admin/courses")}
            className="mr-4 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium disabled:opacity-50"
          >
            {submitting ? "처리 중..." : "과정 수정"}
          </button>
        </div>
      </form>
    </div>
  );
}
