"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// 교육과정 인터페이스 정의
interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnailUrl: string;
  thumbnailWidth: number;
  thumbnailHeight: number;
  category: string;
  price: number | null;
  schedule: string | null;
  isActive: boolean;
  target: string | null;
  curriculum?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 카테고리 인터페이스 정의
interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Cloudinary 이미지 URL을 사용할 때 필요한 로더
const cloudinaryLoader = ({ src, width }: { src: string; width: number }) => {
  try {
    // Cloudinary URL인 경우에만 처리
    if (src.includes("cloudinary.com")) {
      // URL이 이미 변환 매개변수를 포함하는 경우 그대로 반환
      if (src.includes("/upload/c_")) {
        return src;
      }

      // 이미지 최적화 매개변수 추가
      const params = ["c_fill", "g_auto", `w_${width}`, "q_auto", "f_auto"];
      const paramsString = params.join(",");
      return src.replace("/upload/", `/upload/${paramsString}/`);
    }

    // 일반 URL은 그대로 반환
    return src;
  } catch (error) {
    console.error("이미지 URL 변환 오류:", error);
    return src;
  }
};

// 디버깅을 위한 로깅 함수
const logImageDetails = (course: Course) => {
  if (course.thumbnailUrl) {
    console.log(
      `[이미지 디버깅] 과정: ${course.title}, URL: ${course.thumbnailUrl}`
    );
    console.log(
      `[이미지 디버깅] 이미지 크기: ${course.thumbnailWidth}x${course.thumbnailHeight}`
    );

    // Cloudinary URL 변환 테스트
    if (course.thumbnailUrl.includes("cloudinary.com")) {
      const transformedUrl = cloudinaryLoader({
        src: course.thumbnailUrl,
        width: 800,
      });
      console.log(`[이미지 디버깅] 변환된 URL: ${transformedUrl}`);
    }
  } else {
    console.log(`[이미지 디버깅] 과정: ${course.title}, 썸네일 URL 없음`);
  }
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showPastCourses, setShowPastCourses] = useState<boolean>(false);

  // 교육과정과 카테고리 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 교육과정 데이터 가져오기
        const coursesResponse = await fetch("/api/courses");
        if (!coursesResponse.ok) {
          throw new Error("교육과정 목록을 불러오는데 실패했습니다.");
        }
        const coursesData = await coursesResponse.json();

        // 이미지 URL 디버깅
        console.log("[데이터 디버깅] 받은 과정 데이터:", coursesData);
        if (Array.isArray(coursesData) && coursesData.length > 0) {
          coursesData.forEach(logImageDetails);
        }

        // 카테고리 데이터 가져오기
        const categoriesResponse = await fetch("/api/categories");
        if (!categoriesResponse.ok) {
          throw new Error("카테고리 목록을 불러오는데 실패했습니다.");
        }
        const categoriesData = await categoriesResponse.json();

        setCourses(coursesData);
        setCategories(categoriesData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 일정을 파싱하여 마지막 일정의 종료일이 지났는지 확인하는 함수
  const isPastCourse = (course: Course) => {
    if (!course.schedule) return false;

    try {
      // 일정 데이터 파싱 시도
      const scheduleData = JSON.parse(course.schedule);

      // 배열이 아니면 일반 문자열로 처리
      if (!Array.isArray(scheduleData)) return false;

      // 빈 배열이면 과거 과정이 아님
      if (scheduleData.length === 0) return false;

      // 마지막 일정의 종료일 확인
      const lastSchedule = scheduleData[scheduleData.length - 1];
      if (!lastSchedule.endDate) return false;

      const endDate = new Date(lastSchedule.endDate);
      const today = new Date();

      // 종료일이 오늘보다 이전이면 과거 과정
      return endDate < today;
    } catch (error) {
      // 파싱 실패 시 과거 과정이 아닌 것으로 간주
      return false;
    }
  };

  // 일정 데이터에서 다음 일정을 가져오는 함수
  const getNextSchedule = (course: Course) => {
    if (!course.schedule) return null;

    try {
      const scheduleData = JSON.parse(course.schedule);

      if (!Array.isArray(scheduleData) || scheduleData.length === 0)
        return null;

      // 현재 일자 이후의 일정 찾기
      const today = new Date();
      const upcomingSchedules = scheduleData.filter(
        (schedule) => new Date(schedule.endDate) >= today
      );

      if (upcomingSchedules.length === 0) return null;

      // 가장 빠른 일정 반환
      return upcomingSchedules.sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      )[0];
    } catch (error) {
      return null;
    }
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // 필터링된 교육과정 목록
  const filteredCourses = courses.filter((course) => {
    // 비활성화된 과정은 표시하지 않음
    if (!course.isActive) return false;

    // 카테고리 필터링
    if (selectedCategory !== "all" && course.category !== selectedCategory)
      return false;

    // 과거 과정 필터링
    if (!showPastCourses && isPastCourse(course)) return false;

    return true;
  });

  // 카테고리 이름 가져오기
  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">교육과정</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-700 h-48 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">교육과정</h1>
        <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-4">교육과정</h1>
      <p className="text-gray-300 mb-8">
        바디앤솔 아카데미에서 제공하는 다양한 교육과정을 살펴보세요. 전문적인
        강사진과 체계적인 커리큘럼으로 구성된 교육을 통해 전문가로 성장하세요.
      </p>

      {/* 필터링 옵션 */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <label
            htmlFor="category-filter"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            카테고리
          </label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-2 bg-gray-800 border border-gray-600 text-white rounded-md focus:ring-[#b5b67d] focus:border-[#b5b67d]"
          >
            <option value="all">전체 카테고리</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={showPastCourses}
              onChange={(e) => setShowPastCourses(e.target.checked)}
              className="h-4 w-4 text-[#b5b67d] focus:ring-[#b5b67d] border-gray-600 rounded"
            />
            <span className="ml-2 text-gray-300">지난 과정 포함</span>
          </label>
        </div>
      </div>

      {/* 교육과정 목록 */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-300">조건에 맞는 교육과정이 없습니다.</p>
          <button
            onClick={() => {
              setSelectedCategory("all");
              setShowPastCourses(true);
            }}
            className="mt-4 text-[#b5b67d] hover:text-[#f5f6e4]"
          >
            모든 과정 보기
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => {
            const nextSchedule = getNextSchedule(course);
            return (
              <Link href={`/courses/${course.slug}`} key={course.id}>
                <div className="bg-gray-800 rounded-lg overflow-hidden transition-all duration-300 border border-gray-700 hover:border-[#b5b67d] hover:shadow-[0_0_15px_rgba(181,182,125,0.3)] group">
                  <div className="relative h-48 overflow-hidden bg-gray-700">
                    {course.thumbnailUrl ? (
                      <img
                        src={course.thumbnailUrl}
                        alt={course.title}
                        style={{
                          display: "block",
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          position: "relative",
                          zIndex: 1,
                        }}
                        className="transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                          console.error(
                            `이미지 로딩 오류: ${course.thumbnailUrl}`
                          );
                          (e.currentTarget as HTMLImageElement).src =
                            "/placeholders/course-placeholder.png";
                        }}
                      />
                    ) : (
                      <img
                        src="/placeholders/course-placeholder.png"
                        alt={course.title}
                        style={{
                          display: "block",
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          position: "relative",
                          zIndex: 1,
                        }}
                        className="transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                    )}
                  </div>
                  <div className="p-6">
                    <span className="inline-block px-2 py-1 text-xs font-semibold text-[#8a7e71] bg-[#f5f6e4] rounded-full mb-2">
                      {getCategoryName(course.category)}
                    </span>
                    <h2 className="text-xl font-bold mb-2 text-white group-hover:text-[#b5b67d] transition-colors">
                      {course.title}
                    </h2>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    {nextSchedule ? (
                      <div className="text-sm text-gray-400 mb-4">
                        <span className="font-medium text-gray-300">일정:</span>{" "}
                        {formatDate(nextSchedule.startDate)} ~{" "}
                        {formatDate(nextSchedule.endDate)}
                      </div>
                    ) : (
                      course.schedule && (
                        <div className="text-sm text-gray-400 mb-4">
                          <span className="font-medium text-gray-300">
                            일정:
                          </span>{" "}
                          문의 요망
                        </div>
                      )
                    )}

                    {course.price !== null && (
                      <div className="text-[#b5b67d] font-bold">
                        {course.price.toLocaleString()}원
                      </div>
                    )}

                    {isPastCourse(course) && (
                      <div className="mt-2 inline-block px-2 py-1 text-xs font-semibold text-white bg-gray-600 rounded">
                        지난 과정
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
