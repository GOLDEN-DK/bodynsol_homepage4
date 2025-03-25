"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

// 과정 인터페이스 정의
interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  curriculum: string;
  thumbnailUrl: string;
  thumbnailWidth: number;
  thumbnailHeight: number;
  category: string;
  price: number | null;
  schedule: string | null;
  isActive: boolean;
  target: string | null;
  instructor: string | null;
  instructorInfo: string | null;
  instructorImageUrl: string | null;
}

// 일정 인터페이스 정의
interface ScheduleItem {
  id: string;
  startDate: string;
  endDate: string;
  location: string;
  teachers: string[];
}

// 강사 인터페이스 정의
interface Teacher {
  id: string;
  name: string;
  bio: string | null;
  profileImage: string | null;
}

export default function CourseDetail() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  
  const [course, setCourse] = useState<Course | null>(null);
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);
  
  // 과정 데이터 가져오기
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        
        // slug로 과정 조회하는 API 호출
        const response = await fetch(`/api/courses/slug/${slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("과정을 찾을 수 없습니다.");
          }
          throw new Error("과정 정보를 불러오는데 실패했습니다.");
        }
        
        const data = await response.json();
        setCourse(data);
        
        // 일정 데이터 파싱
        if (data.schedule) {
          try {
            const parsedSchedules = JSON.parse(data.schedule);
            if (Array.isArray(parsedSchedules)) {
              setSchedules(parsedSchedules);
              
              // 현재 일정이 있으면 첫 번째 현재 일정을 기본 선택
              const currentSchedules = parsedSchedules.filter(schedule => 
                new Date(schedule.endDate) >= new Date()
              );
              
              if (currentSchedules.length > 0) {
                setSelectedSchedule(currentSchedules[0].id);
              }
            }
          } catch (e) {
            console.error("일정 데이터 파싱 오류:", e);
          }
        }
        
        // 강사 정보 가져오기
        if (data.instructor) {
          try {
            const teachersResponse = await fetch(`/api/teachers?ids=${data.instructor}`);
            if (teachersResponse.ok) {
              const teachersData = await teachersResponse.json();
              setTeachers(Array.isArray(teachersData) ? teachersData : [teachersData]);
            }
          } catch (e) {
            console.error("강사 정보 가져오기 오류:", e);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourseData();
  }, [slug]);
  
  // 현재 일정과 지난 일정 분류
  const currentSchedules = schedules.filter(schedule => 
    new Date(schedule.endDate) >= new Date()
  );
  
  const pastSchedules = schedules.filter(schedule => 
    new Date(schedule.endDate) < new Date()
  );
  
  // 일정 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // 신청하기 버튼 핸들러
  const handleApplyClick = () => {
    if (!selectedSchedule) {
      alert("신청할 일정을 선택해주세요.");
      return;
    }
    
    router.push(`/courses/${slug}/apply?scheduleId=${selectedSchedule}`);
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6 mb-6"></div>
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
        </div>
      </div>
    );
  }
  
  if (error || !course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error || "과정 정보를 불러올 수 없습니다."}</p>
        </div>
        <Link
          href="/courses"
          className="text-blue-600 hover:text-blue-800"
        >
          &larr; 모든 과정 보기
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 브레드크럼 네비게이션 */}
      <nav className="mb-6 text-sm">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              홈
            </Link>
          </li>
          <li className="text-gray-500">/</li>
          <li>
            <Link href="/courses" className="text-gray-600 hover:text-gray-900">
              교육과정
            </Link>
          </li>
          <li className="text-gray-500">/</li>
          <li className="text-gray-900 font-medium">{course.title}</li>
        </ol>
      </nav>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 왼쪽 - 과정 이미지 및 상세 정보 */}
        <div className="lg:col-span-2 space-y-8">
          <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
          
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <Image
              src={course.thumbnailUrl}
              alt={course.title}
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover"
              priority
            />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">과정 소개</h2>
            <p className="text-gray-800 whitespace-pre-line">{course.description}</p>
          </div>
          
          {course.target && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">교육대상</h2>
              <p className="text-gray-800 whitespace-pre-line">{course.target}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">커리큘럼</h2>
            <div 
              className="prose max-w-none text-gray-800"
              dangerouslySetInnerHTML={{ __html: course.curriculum || '' }}
            ></div>
          </div>
          
          {/* 강사 정보 */}
          {(teachers.length > 0 || course.instructorInfo) && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">강사 소개</h2>
              
              {teachers.length > 0 ? (
                <div className="space-y-6">
                  {teachers.map(teacher => (
                    <div key={teacher.id} className="flex flex-col md:flex-row gap-4">
                      {teacher.profileImage && (
                        <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src={teacher.profileImage}
                            alt={teacher.name}
                            width={96}
                            height={96}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{teacher.name}</h3>
                        {teacher.bio && (
                          <p className="text-gray-800 mt-2 whitespace-pre-line">{teacher.bio}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : course.instructorInfo ? (
                <div className="space-y-4">
                  {course.instructorImageUrl && (
                    <div className="w-24 h-24 rounded-full overflow-hidden">
                      <Image
                        src={course.instructorImageUrl}
                        alt="강사"
                        width={96}
                        height={96}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                  <div className="text-gray-800 whitespace-pre-line">{course.instructorInfo}</div>
                </div>
              ) : null}
            </div>
          )}
          
          {/* 일정 정보 */}
          {schedules.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">교육 일정</h2>
              
              {currentSchedules.length > 0 && (
                <>
                  <h3 className="text-lg font-medium text-gray-800">진행 예정 일정</h3>
                  <div className="space-y-4">
                    {currentSchedules.map(schedule => (
                      <div 
                        key={schedule.id} 
                        className={`p-4 border rounded-lg cursor-pointer ${
                          selectedSchedule === schedule.id 
                            ? 'border-[#b5b67d] bg-[#f5f6e4]' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedSchedule(schedule.id)}
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id={`schedule-${schedule.id}`}
                            name="schedule"
                            checked={selectedSchedule === schedule.id}
                            onChange={() => setSelectedSchedule(schedule.id)}
                            className="h-4 w-4 text-[#b5b67d] focus:ring-[#b5b67d] border-gray-300"
                          />
                          <label 
                            htmlFor={`schedule-${schedule.id}`}
                            className="ml-3 block text-gray-800"
                          >
                            <span className="font-medium">
                              {formatDate(schedule.startDate)} ~ {formatDate(schedule.endDate)}
                            </span>
                            <div className="text-sm text-gray-600 mt-1">
                              <span className="font-medium">장소:</span> {schedule.location}
                            </div>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              
              {pastSchedules.length > 0 && (
                <>
                  <h3 className="text-lg font-medium text-gray-800 mt-6">지난 일정</h3>
                  <div className="space-y-2">
                    {pastSchedules.map(schedule => (
                      <div key={schedule.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <span className="font-medium text-gray-600">
                          {formatDate(schedule.startDate)} ~ {formatDate(schedule.endDate)}
                        </span>
                        <div className="text-sm text-gray-500 mt-1">
                          <span>장소:</span> {schedule.location}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        
        {/* 오른쪽 - 과정 요약 정보 및 신청 버튼 */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow-md rounded-lg p-6 sticky top-24">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">과정 정보</h2>
              
              <div className="border-t border-b py-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">카테고리</span>
                  <span className="text-gray-900 font-medium">{course.category}</span>
                </div>
                
                {course.price !== null && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">수강료</span>
                    <span className="text-gray-900 font-medium">
                      {course.price.toLocaleString()}원
                    </span>
                  </div>
                )}
                
                {currentSchedules.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">교육 일정</span>
                    <span className="text-gray-900 font-medium">{currentSchedules.length}개</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                {currentSchedules.length > 0 ? (
                  <button
                    onClick={handleApplyClick}
                    className="block w-full bg-[#b5b67d] hover:bg-[#a0a169] text-white text-center font-bold py-3 px-4 rounded-lg transition duration-300"
                  >
                    신청하기
                  </button>
                ) : (
                  <div className="text-center py-2 px-4 bg-gray-100 rounded-lg text-gray-500">
                    현재 신청 가능한 일정이 없습니다
                  </div>
                )}
                
                <a
                  href={`mailto:info@bodynsol.com?subject=과정 문의: ${course.title}`}
                  className="block w-full border border-[#8a7e71] text-[#8a7e71] hover:bg-[#8a7e71] hover:text-white text-center font-bold py-3 px-4 rounded-lg transition duration-300"
                >
                  문의하기
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 