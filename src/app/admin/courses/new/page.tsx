"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamicImport from "next/dynamic";

// 동적 렌더링 설정
// next/dynamic과 이름이 충돌하지 않도록 별도로 선언
export const dynamic = "force-dynamic";

// 클라이언트 사이드에서만 렌더링
export const runtime = "edge";

// 클라이언트 사이드에서만 로드되도록 에디터를 동적으로 임포트
const RichTextEditor = dynamicImport(
  () => import("@/components/editor/RichTextEditor"),
  {
    ssr: false,
    loading: () => <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">에디터 로딩 중...</div>
  }
);

// 결제 방법 옵션
const PAYMENT_METHODS = [
  { id: "onsite", label: "현장결제" },
  { id: "card", label: "신용카드" },
  { id: "transfer", label: "계좌이체" },
];

// 카테고리 타입 정의
interface Category {
  id: string;
  name: string;
  slug: string;
}

// 일정 인터페이스 추가
interface ScheduleItem {
  id: string;
  startDate: string;
  endDate: string;
  location: string;
  teachers: string[];
}

// courseData 인터페이스 업데이트
interface CourseData {
  title: string;
  slug: string;
  description: string;
  curriculum: string;
  thumbnailUrl: string;
  categoryId: string;
  instructorInfo: string;
  price: number;
  discountPrice: number;
  paymentMethods: string[];
  isActive: boolean;
  schedule: string;
  scheduleItems: ScheduleItem[];
}

export default function NewCourse() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  // 클라이언트 사이드에서만 useSession 사용
  const { data: session, status } = useSession();

  // 컴포넌트가 마운트되었는지 확인
  useEffect(() => {
    setMounted(true);
    fetchCategories();
    fetchTeachers(); // 강사 목록 가져오기
    console.log("Component mounted, RichTextEditor imported:", !!RichTextEditor);
  }, []);

  // 과정 정보 상태
  const [courseData, setCourseData] = useState<CourseData>({
    title: "",
    slug: "",
    description: "",
    curriculum: "",
    thumbnailUrl: "",
    categoryId: "",
    instructorInfo: "",
    price: 0,
    discountPrice: 0,
    paymentMethods: [],
    isActive: true,
    schedule: "",
    scheduleItems: [],
  });

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailUploadLoading, setThumbnailUploadLoading] = useState(false);
  const [thumbnailInputType, setThumbnailInputType] = useState<'url' | 'file'>('url');

  // 새 일정 상태 추가
  const [newSchedule, setNewSchedule] = useState<Omit<ScheduleItem, 'id'>>({
    startDate: '',
    endDate: '',
    location: '',
    teachers: [],
  });
  
  // 강사 목록 상태 추가
  const [teachers, setTeachers] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);

  // 세션 체크
  useEffect(() => {
    if (status === "unauthenticated") {
      signIn();
    } else if (session?.user?.role !== "admin") {
      router.push("/");
    }
  }, [session, status, router]);

  // 카테고리 데이터 가져오기
  useEffect(() => {
    if (status === "authenticated") {
      fetchCategories();
    }
  }, [status]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      
      if (!response.ok) {
        throw new Error("카테고리 목록을 가져오는데 실패했습니다.");
      }

      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
    }
  };

  // 강사 목록을 가져오는 함수 추가
  const fetchTeachers = async () => {
    try {
      const response = await fetch('/api/teachers');
      const data = await response.json();
      setTeachers(data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  // 입력 변경 핸들러
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    
    if (name === 'price' || name === 'discountPrice') {
      // 숫자 필드는 숫자로 변환
      setCourseData({
        ...courseData,
        [name]: value === '' ? 0 : Number(value),
      });
    } else {
      // 문자열 필드는 그대로 사용
      setCourseData({
        ...courseData,
        [name]: value,
      });
    }
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
      curriculum: html,
    });
  };

  // 슬러그 자동 생성
  const handleTitleBlur = () => {
    if (courseData.title && !courseData.slug) {
      const slug = courseData.title
        .toLowerCase()
        .replace(/[^a-z0-9가-힣]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      setCourseData({
        ...courseData,
        slug,
      });
    }
  };

  // 썸네일 파일 업로드 핸들러
  const handleThumbnailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
    }
  };

  // 썸네일 업로드
  const uploadThumbnail = async (): Promise<string | null> => {
    if (!thumbnailFile) return null;
    
    try {
      setThumbnailUploadLoading(true);
      
      // FormData 생성
      const formData = new FormData();
      formData.append('file', thumbnailFile);
      
      console.log('업로드 시도:', thumbnailFile.name, thumbnailFile.type, thumbnailFile.size);
      
      // 서버에 업로드 요청
      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      });
      
      // 응답 데이터 확인
      const data = await response.json();
      
      if (!response.ok) {
        const errorMsg = data.error || '이미지 업로드에 실패했습니다.';
        console.error('서버 응답 오류:', { status: response.status, message: errorMsg });
        throw new Error(errorMsg);
      }
      
      console.log('업로드 성공:', data);
      return data.url; // 업로드된 이미지 URL 반환
    } catch (error) {
      console.error('썸네일 업로드 오류:', error);
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('썸네일 업로드 중 알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setThumbnailUploadLoading(false);
    }
  };

  // 새 일정 입력 핸들러 추가
  const handleScheduleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewSchedule(prev => ({ ...prev, [name]: value }));
  };

  // 강사 선택 핸들러 추가
  const handleTeacherSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedTeachers(selectedOptions);
    setNewSchedule(prev => ({ ...prev, teachers: selectedOptions }));
  };

  // 일정 추가 핸들러 - 신규 과정에서는 로컬 상태에만 추가
  const handleAddSchedule = () => {
    // 필수 필드 검증
    if (!newSchedule.startDate || !newSchedule.endDate || !newSchedule.location) {
      alert('시작일, 종료일, 장소는 필수 항목입니다.');
      return;
    }

    // 로컬 상태에 일정 추가
    const scheduleWithId: ScheduleItem = {
      ...newSchedule,
      id: Date.now().toString(), // 임시 ID 생성
    };

    setCourseData(prev => ({
      ...prev,
      scheduleItems: [...prev.scheduleItems, scheduleWithId],
    }));

    // 새 일정 폼 초기화
    setNewSchedule({
      startDate: '',
      endDate: '',
      location: '',
      teachers: [],
    });
    setSelectedTeachers([]);
  };

  // 일정 삭제 핸들러
  const handleDeleteSchedule = (scheduleId: string) => {
    setCourseData(prev => ({
      ...prev,
      scheduleItems: prev.scheduleItems.filter(item => item.id !== scheduleId),
    }));
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 썸네일 URL 처리
      let thumbnailUrl = courseData.thumbnailUrl;
      
      // 파일 업로드 방식을 선택한 경우
      if (thumbnailInputType === 'file' && thumbnailFile) {
        try {
          const uploadedUrl = await uploadThumbnail();
          if (uploadedUrl) {
            thumbnailUrl = uploadedUrl;
          } else {
            console.warn('썸네일 업로드 실패, URL이 반환되지 않음');
            if (!thumbnailUrl) {
              throw new Error('썸네일 이미지를 업로드하거나 URL을 입력해주세요.');
            }
          }
        } catch (uploadError) {
          console.error('썸네일 업로드 처리 오류:', uploadError);
          throw uploadError;
        }
      }
      
      // 필수 필드 검증
      if (
        !courseData.title ||
        !courseData.slug ||
        !courseData.description ||
        !courseData.curriculum ||
        !thumbnailUrl ||
        !courseData.categoryId
      ) {
        throw new Error("필수 항목을 모두 입력해주세요.");
      }

      // 일정 데이터를 JSON 문자열로 변환
      const formData = {
        title: courseData.title,
        slug: courseData.slug,
        description: courseData.description,
        thumbnailUrl: thumbnailUrl,
        thumbnailWidth: 800,
        thumbnailHeight: 600,
        category: courseData.categoryId,
        curriculum: courseData.curriculum,
        schedule: courseData.scheduleItems.length > 0 ? JSON.stringify(courseData.scheduleItems) : null,
        price: Number(courseData.price),
        discountPrice: Number(courseData.discountPrice),
        maxStudents: 0,
        location: '',
        duration: '',
        instructor: '',
        instructorInfo: courseData.instructorInfo,
        instructorImageUrl: '',
        paymentMethods: courseData.paymentMethods,
        isActive: courseData.isActive,
      };

      // API 요청
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "과정 추가에 실패했습니다.");
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
        <h1 className="text-2xl font-bold text-gray-900">새 과정 추가</h1>
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
            과정이 성공적으로 추가되었습니다. 잠시 후 목록 페이지로 이동합니다.
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
                onBlur={handleTitleBlur}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                URL에 사용될 고유 식별자입니다. 영문, 숫자, 하이픈(-)만 사용
                가능합니다.
              </p>
            </div>

            <div>
              <label
                htmlFor="categoryId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                카테고리 <span className="text-red-500">*</span>
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={courseData.categoryId}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                required
              >
                <option value="">카테고리 선택</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {categories.length === 0 && (
                <p className="mt-1 text-sm text-red-500">
                  등록된 카테고리가 없습니다. 먼저{" "}
                  <Link
                    href="/admin/categories/new"
                    className="text-blue-600 hover:underline"
                  >
                    카테고리를 추가
                  </Link>
                  해주세요.
                </p>
              )}
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                required
              ></textarea>
            </div>

            <div>
              <label
                htmlFor="thumbnailUrl"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                썸네일 이미지 <span className="text-red-500">*</span>
              </label>
              
              <div className="mb-2">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="url-input"
                      name="thumbnailInputType"
                      value="url"
                      checked={thumbnailInputType === 'url'}
                      onChange={() => setThumbnailInputType('url')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="url-input" className="ml-2 block text-sm text-gray-700">
                      URL 입력
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="file-input"
                      name="thumbnailInputType"
                      value="file"
                      checked={thumbnailInputType === 'file'}
                      onChange={() => setThumbnailInputType('file')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="file-input" className="ml-2 block text-sm text-gray-700">
                      파일 업로드
                    </label>
                  </div>
                </div>
              </div>
              
              {thumbnailInputType === 'url' ? (
                <input
                  type="text"
                  id="thumbnailUrl"
                  name="thumbnailUrl"
                  value={courseData.thumbnailUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder="이미지 URL을 입력하세요"
                  required={thumbnailInputType === 'url'}
                />
              ) : (
                <div>
                  <input
                    type="file"
                    id="thumbnailFile"
                    name="thumbnailFile"
                    accept="image/*"
                    onChange={handleThumbnailFileChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    required={thumbnailInputType === 'file' && !thumbnailFile}
                  />
                  {thumbnailFile && (
                    <p className="mt-1 text-sm text-green-600">
                      선택된 파일: {thumbnailFile.name}
                    </p>
                  )}
                </div>
              )}
              <p className="mt-1 text-xs text-gray-500">
                이미지 권장 크기: 800 x 600px
              </p>
            </div>
          </div>

          {/* 강사 정보 */}
          <div className="space-y-4 md:col-span-2">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
              강사 정보
            </h2>

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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              ></textarea>
              <p className="mt-1 text-sm text-gray-500">
                일정별 강사는 추후 일정 등록 시 별도로 추가할 수 있습니다.
                여기에는 과정 소개에 표시될 일반적인 강사 정보를 입력하세요.
              </p>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
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
              상세 커리큘럼
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                과정 상세 내용 <span className="text-red-500">*</span>
              </label>
              {mounted ? (
                <RichTextEditor
                  content={courseData.curriculum}
                  onChange={handleContentChange}
                  placeholder="과정에 대한 상세 내용을 입력하세요..."
                />
              ) : (
                <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">클라이언트 측 렌더링 대기 중...</div>
              )}
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

        {/* 일정 관리 섹션 추가 */}
        <div className="bg-white rounded-md shadow-sm p-4 mb-6">
          <h2 className="text-xl font-medium mb-4">일정 관리</h2>
          
          {/* 일정 목록 */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">일정 목록</h3>
            
            {courseData.scheduleItems.length === 0 ? (
              <p className="text-gray-900">등록된 일정이 없습니다.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b text-gray-900">시작일</th>
                      <th className="py-2 px-4 border-b text-gray-900">종료일</th>
                      <th className="py-2 px-4 border-b text-gray-900">장소</th>
                      <th className="py-2 px-4 border-b text-gray-900">강사</th>
                      <th className="py-2 px-4 border-b text-gray-900">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courseData.scheduleItems.map((schedule) => {
                      // 날짜 포맷팅 함수
                      const formatDate = (dateString: string) => {
                        const date = new Date(dateString);
                        return date.toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                        });
                      };

                      // 강사 이름 가져오기
                      const getTeacherNames = (teacherIds: string[]) => {
                        return teacherIds
                          .map(id => {
                            const teacher = teachers.find(t => t.id === id);
                            return teacher ? teacher.name : '';
                          })
                          .filter(Boolean)
                          .join(', ');
                      };

                      return (
                        <tr key={schedule.id} className="hover:bg-gray-50">
                          <td className="py-2 px-4 border-b text-gray-900">{formatDate(schedule.startDate)}</td>
                          <td className="py-2 px-4 border-b text-gray-900">{formatDate(schedule.endDate)}</td>
                          <td className="py-2 px-4 border-b text-gray-900">{schedule.location}</td>
                          <td className="py-2 px-4 border-b text-gray-900">{getTeacherNames(schedule.teachers)}</td>
                          <td className="py-2 px-4 border-b text-gray-900">
                            <button
                              type="button"
                              onClick={() => handleDeleteSchedule(schedule.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              삭제
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          {/* 일정 추가 폼 */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-medium mb-4">새 일정 추가</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900">시작일 *</label>
                <input
                  type="date"
                  name="startDate"
                  value={newSchedule.startDate}
                  onChange={handleScheduleInputChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900">종료일 *</label>
                <input
                  type="date"
                  name="endDate"
                  value={newSchedule.endDate}
                  onChange={handleScheduleInputChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                  required
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-900">장소 *</label>
              <input
                type="text"
                name="location"
                value={newSchedule.location}
                onChange={handleScheduleInputChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                placeholder="장소를 입력하세요"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-900">강사 선택</label>
              <select
                multiple
                onChange={handleTeacherSelection}
                value={selectedTeachers}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 h-32"
              >
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-700 mt-1">* Ctrl 키를 누른 상태에서 여러 강사를 선택할 수 있습니다.</p>
            </div>
            
            <button
              type="button"
              onClick={handleAddSchedule}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              일정 추가
            </button>
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
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium disabled:opacity-50"
          >
            {loading ? "처리 중..." : "과정 추가"}
          </button>
        </div>
      </form>
    </div>
  );
}
