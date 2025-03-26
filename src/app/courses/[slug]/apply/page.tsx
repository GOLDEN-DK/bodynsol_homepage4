"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// 과정 인터페이스 정의
interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnailUrl: string;
  price: number | null;
  category: string;
}

// 일정 인터페이스 정의
interface ScheduleItem {
  id: string;
  startDate: string;
  endDate: string;
  location: string;
  teachers: string[];
}

// 신청 정보 인터페이스
interface ApplicationData {
  koreanName: string;
  englishName: string;
  email: string;
  phone: string;
  gender: string;
  age: string;
  occupation: string;
  region: string;
  pilatesExperience: string;
  question: string;
}

// 결제 방법 인터페이스
interface PaymentMethod {
  id: string;
  name: string;
}

// 지역 옵션
const REGION_OPTIONS = [
  { id: "seoul", name: "서울" },
  { id: "gyeonggi", name: "경기도" },
  { id: "sejong", name: "세종" },
  { id: "daejeon", name: "대전" },
  { id: "daegu", name: "대구" },
  { id: "cheongju", name: "청주" },
  { id: "busan", name: "부산" },
  { id: "other", name: "기타" },
];

// 필라테스 경험 옵션
const EXPERIENCE_OPTIONS = [
  { id: "none", name: "없음" },
  { id: "3months", name: "3개월" },
  { id: "6months", name: "6개월" },
  { id: "1year", name: "1년" },
  { id: "2years", name: "2년" },
  { id: "3years", name: "3년" },
  { id: "other", name: "기타" },
];

// 결제 방법 옵션
const PAYMENT_METHODS = [
  { id: "onsite", name: "현장 결제" },
  { id: "card", name: "신용카드" },
  { id: "transfer", name: "계좌이체" },
];

// 신청 단계 정의
enum ApplicationStep {
  PERSONAL_INFO = 1,
  PAYMENT = 2,
  CONFIRMATION = 3,
}

// 카테고리 매핑 수정
const CATEGORY_MAPPING: { [key: string]: string } = {
  mat: "매트 필라테스",
  equipment: "기구 필라테스",
  rehabilitation: "재활 필라테스",
  anatomy: "해부학",
  business: "필라테스 창업",
  special: "스페셜 클래스",
};

// 입력 필드 기본 스타일 수정
const inputBaseStyle = `block w-full rounded-md border bg-gray-700 text-gray-100 placeholder-gray-400 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-colors duration-200`;

export default function CourseApplication() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params?.slug as string;
  const scheduleId = searchParams.get("scheduleId");

  const [step, setStep] = useState<ApplicationStep>(
    ApplicationStep.PERSONAL_INFO
  );
  const [course, setCourse] = useState<Course | null>(null);
  const [schedule, setSchedule] = useState<ScheduleItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");
  const [categoryName, setCategoryName] = useState<string>("");
  const [teacherNames, setTeacherNames] = useState<string[]>([]);

  // 진행 단계 인디케이터
  const StepIndicator = () => {
    return (
      <div className="mb-10">
        <div className="flex items-center justify-center">
          <nav className="flex items-center" aria-label="Progress">
            <ol className="flex items-center space-x-5 sm:space-x-8">
              <li className="relative">
                <div className="flex items-center">
                  <div
                    className={`relative flex h-12 w-12 items-center justify-center rounded-full ${
                      step >= ApplicationStep.PERSONAL_INFO
                        ? "bg-lime-600"
                        : "bg-gray-700"
                    }`}
                  >
                    <span className="text-white font-semibold">01</span>
                    {step > ApplicationStep.PERSONAL_INFO && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                        <svg
                          className="h-3 w-3 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    )}
                  </div>
                  <div className="ml-4 min-w-0 flex flex-col">
                    <span
                      className={`text-sm font-medium ${
                        step >= ApplicationStep.PERSONAL_INFO
                          ? "text-lime-400"
                          : "text-gray-500"
                      }`}
                    >
                      1단계
                    </span>
                    <span className="text-sm font-medium text-gray-300">
                      개인 정보
                    </span>
                  </div>
                </div>
              </li>

              <li className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div
                    className={`h-0.5 w-full ${
                      step > ApplicationStep.PERSONAL_INFO
                        ? "bg-lime-600"
                        : "bg-gray-700"
                    }`}
                  ></div>
                </div>
                <div className="relative flex items-center">
                  <div
                    className={`relative flex h-12 w-12 items-center justify-center rounded-full ${
                      step >= ApplicationStep.PAYMENT
                        ? "bg-lime-600"
                        : "bg-gray-700"
                    }`}
                  >
                    <span className="text-white font-semibold">02</span>
                    {step > ApplicationStep.PAYMENT && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                        <svg
                          className="h-3 w-3 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    )}
                  </div>
                  <div className="ml-4 min-w-0 flex flex-col">
                    <span
                      className={`text-sm font-medium ${
                        step >= ApplicationStep.PAYMENT
                          ? "text-lime-400"
                          : "text-gray-500"
                      }`}
                    >
                      2단계
                    </span>
                    <span className="text-sm font-medium text-gray-300">
                      결제 정보
                    </span>
                  </div>
                </div>
              </li>

              <li className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div
                    className={`h-0.5 w-full ${
                      step > ApplicationStep.PAYMENT
                        ? "bg-lime-600"
                        : "bg-gray-700"
                    }`}
                  ></div>
                </div>
                <div className="relative flex items-center">
                  <div
                    className={`relative flex h-12 w-12 items-center justify-center rounded-full ${
                      step >= ApplicationStep.CONFIRMATION
                        ? "bg-lime-600"
                        : "bg-gray-700"
                    }`}
                  >
                    <span className="text-white font-semibold">03</span>
                  </div>
                  <div className="ml-4 min-w-0 flex flex-col">
                    <span
                      className={`text-sm font-medium ${
                        step >= ApplicationStep.CONFIRMATION
                          ? "text-lime-400"
                          : "text-gray-500"
                      }`}
                    >
                      3단계
                    </span>
                    <span className="text-sm font-medium text-gray-300">
                      신청 완료
                    </span>
                  </div>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>
    );
  };

  // 신청 정보 상태
  const [applicationData, setApplicationData] = useState<ApplicationData>({
    koreanName: "",
    englishName: "",
    email: "",
    phone: "",
    gender: "",
    age: "",
    occupation: "",
    region: "",
    pilatesExperience: "",
    question: "",
  });

  // 유효성 검사 상태
  const [errors, setErrors] = useState<
    Partial<Record<keyof ApplicationData, string>>
  >({});

  // 과정 및 일정 정보 가져오기
  useEffect(() => {
    const fetchData = async () => {
      if (!slug || !scheduleId) {
        setError("필요한 정보가 누락되었습니다.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // 과정 정보 가져오기
        const courseResponse = await fetch(`/api/courses/slug/${slug}`);
        if (!courseResponse.ok) {
          throw new Error("과정 정보를 불러오는데 실패했습니다.");
        }
        const courseData = await courseResponse.json();
        setCourse(courseData);

        // 카테고리 정보 가져오기
        if (courseData.category) {
          try {
            const categoryResponse = await fetch(
              `/api/categories/${courseData.category}`
            );
            if (categoryResponse.ok) {
              const categoryData = await categoryResponse.json();
              setCategoryName(categoryData.name);
            } else {
              setCategoryName(
                CATEGORY_MAPPING[courseData.category] || courseData.category
              );
            }
          } catch (e) {
            console.error("카테고리 정보 가져오기 오류:", e);
            setCategoryName(
              CATEGORY_MAPPING[courseData.category] || courseData.category
            );
          }
        }

        // 일정 데이터 파싱
        if (courseData.schedule) {
          try {
            const parsedSchedules = JSON.parse(courseData.schedule);
            if (Array.isArray(parsedSchedules)) {
              const selectedSchedule = parsedSchedules.find(
                (sch: ScheduleItem) => sch.id === scheduleId
              );

              if (selectedSchedule) {
                setSchedule(selectedSchedule);

                // 강사 정보 가져오기
                if (
                  selectedSchedule.teachers &&
                  selectedSchedule.teachers.length > 0
                ) {
                  try {
                    const teacherIds = selectedSchedule.teachers.join(",");
                    const teachersResponse = await fetch(
                      `/api/teachers?ids=${teacherIds}`
                    );
                    if (teachersResponse.ok) {
                      const teachersData = await teachersResponse.json();
                      if (Array.isArray(teachersData)) {
                        const names = teachersData.map(
                          (teacher: any) => teacher.name
                        );
                        setTeacherNames(names);
                      }
                    } else {
                      setTeacherNames(selectedSchedule.teachers);
                    }
                  } catch (e) {
                    console.error("강사 정보 가져오기 오류:", e);
                    setTeacherNames(selectedSchedule.teachers);
                  }
                }
              } else {
                throw new Error("선택한 일정을 찾을 수 없습니다.");
              }
            }
          } catch (e) {
            console.error("일정 데이터 파싱 오류:", e);
            throw new Error("일정 정보를 불러오는데 실패했습니다.");
          }
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, scheduleId]);

  // 입력 변경 핸들러
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setApplicationData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 입력 시 해당 필드의 오류 메시지 지우기
    if (errors[name as keyof ApplicationData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // 라디오 버튼 변경 핸들러
  const handleRadioChange = (name: string, value: string) => {
    setApplicationData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 입력 시 해당 필드의 오류 메시지 지우기
    if (errors[name as keyof ApplicationData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // 폼 유효성 검사
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ApplicationData, string>> = {};

    // 필수 필드 검사
    if (!applicationData.koreanName)
      newErrors.koreanName = "이름(한글)을 입력해주세요.";
    if (!applicationData.email) newErrors.email = "이메일을 입력해주세요.";
    if (!applicationData.phone) newErrors.phone = "전화번호를 입력해주세요.";
    if (!applicationData.gender) newErrors.gender = "성별을 선택해주세요.";
    if (!applicationData.age) newErrors.age = "나이를 입력해주세요.";
    if (!applicationData.occupation)
      newErrors.occupation = "직업(소속)을 입력해주세요.";
    if (!applicationData.region) newErrors.region = "거주지역을 선택해주세요.";
    if (!applicationData.pilatesExperience)
      newErrors.pilatesExperience = "필라테스 운동기간을 선택해주세요.";

    // 이메일 형식 검사
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (applicationData.email && !emailPattern.test(applicationData.email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다.";
    }

    // 전화번호 형식 검사 (숫자, - 만 허용)
    const phonePattern = /^[0-9-]+$/;
    if (applicationData.phone && !phonePattern.test(applicationData.phone)) {
      newErrors.phone = "올바른 전화번호 형식이 아닙니다.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 다음 단계로 이동 핸들러
  const handleNextStep = () => {
    if (step === ApplicationStep.PERSONAL_INFO) {
      if (validateForm()) {
        setStep(ApplicationStep.PAYMENT);
      }
    } else if (step === ApplicationStep.PAYMENT) {
      if (!selectedPaymentMethod) {
        alert("결제 방법을 선택해주세요.");
        return;
      }

      // 신청 데이터 제출
      handleSubmitApplication();
    }
  };

  // 신청서 제출 처리
  const handleSubmitApplication = async () => {
    try {
      if (!course || !schedule) return;

      // 로딩 표시 등 추가할 수 있음

      // API 요청 데이터 준비
      const requestData = {
        courseId: course.id,
        scheduleId: schedule.id,
        ...applicationData,
        paymentMethod: selectedPaymentMethod,
      };

      // API 호출
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "신청 처리 중 오류가 발생했습니다.");
      }

      // 성공 시 확인 단계로 이동
      setStep(ApplicationStep.CONFIRMATION);
    } catch (error) {
      console.error("신청 제출 오류:", error);
      alert(
        error instanceof Error
          ? error.message
          : "신청 처리 중 오류가 발생했습니다."
      );
    }
  };

  // 이전 단계로 이동 핸들러
  const handlePrevStep = () => {
    if (step === ApplicationStep.PAYMENT) {
      setStep(ApplicationStep.PERSONAL_INFO);
    } else if (step === ApplicationStep.CONFIRMATION) {
      setStep(ApplicationStep.PAYMENT);
    }
  };

  // 일정 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 py-12 text-gray-100">
        <div className="container max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center mb-10">
            <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
              과정 신청
            </h1>
            <div className="h-1 w-16 bg-lime-500 rounded-full mb-4"></div>
            <p className="text-gray-400 text-center max-w-xl">
              바디앤솔의 교육 과정에 신청해 주셔서 감사합니다. 아래 양식을
              작성하여 등록을 완료해 주세요.
            </p>
          </div>

          <StepIndicator />

          <div className="bg-gray-800 rounded-lg shadow-xl p-8 mb-8 border border-gray-700">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-700 rounded-full w-1/4 mb-6"></div>
              <div className="h-64 bg-gray-700 rounded-lg mb-6"></div>
              <div className="h-8 bg-gray-700 rounded-full w-1/2 mb-6"></div>
              <div className="h-8 bg-gray-700 rounded-full w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course || !schedule) {
    return (
      <div className="min-h-screen bg-gray-900 py-12 text-gray-100">
        <div className="container max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center mb-10">
            <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
              과정 신청
            </h1>
            <div className="h-1 w-16 bg-lime-500 rounded-full mb-4"></div>
            <p className="text-gray-400 text-center max-w-xl">
              바디앤솔의 교육 과정에 신청해 주셔서 감사합니다. 아래 양식을
              작성하여 등록을 완료해 주세요.
            </p>
          </div>

          <StepIndicator />

          <div className="bg-gray-800 rounded-lg shadow-xl p-8 mb-8 border border-gray-700">
            <div className="bg-red-900 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-300">
                    {error || "과정 또는 일정 정보를 불러올 수 없습니다."}
                  </p>
                </div>
              </div>
            </div>
            <Link
              href={`/courses/${slug}`}
              className="inline-flex items-center justify-center px-5 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-lime-500 transition-colors duration-200"
            >
              <svg
                className="mr-2 -ml-1 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              과정 정보로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 과정 및 일정 정보 표시
  const CourseInfo = () => {
    return (
      <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden mb-8 border border-gray-700 transition-all hover:shadow-2xl">
        <div className="border-b border-gray-700 bg-gray-800/80">
          <div className="px-6 py-4">
            <h2 className="text-lg font-medium text-white">신청 과정 정보</h2>
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {course.thumbnailUrl && (
              <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
                <div className="aspect-w-16 aspect-h-9 relative rounded-lg overflow-hidden bg-gray-900 border border-gray-700">
                  <Image
                    src={course.thumbnailUrl}
                    alt={course.title}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </div>
            )}
            <div className="flex-1">
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-lime-900/50 text-lime-200 border border-lime-700">
                  {categoryName ||
                    CATEGORY_MAPPING[course.category] ||
                    course.category}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {course.title}
              </h3>
              <div className="mt-4 space-y-3 text-sm text-gray-300">
                <div className="flex items-start">
                  <svg
                    className="h-5 w-5 text-lime-400 mt-0.5 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    <span className="font-medium text-gray-200">일정:</span>{" "}
                    {formatDate(schedule.startDate)} ~{" "}
                    {formatDate(schedule.endDate)}
                  </span>
                </div>
                <div className="flex items-start">
                  <svg
                    className="h-5 w-5 text-lime-400 mt-0.5 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    <span className="font-medium text-gray-200">위치:</span>{" "}
                    {schedule.location}
                  </span>
                </div>
                <div className="flex items-start">
                  <svg
                    className="h-5 w-5 text-lime-400 mt-0.5 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  <span>
                    <span className="font-medium text-gray-200">강사:</span>{" "}
                    {teacherNames.length > 0
                      ? teacherNames.map((teacher, index) => (
                          <span key={`teacher-${index}`}>
                            {teacher}
                            {index < teacherNames.length - 1 && ", "}
                          </span>
                        ))
                      : schedule.teachers &&
                        schedule.teachers.map((teacher, index) => (
                          <span key={`teacher-${index}`}>
                            {teacher}
                            {index < schedule.teachers.length - 1 && ", "}
                          </span>
                        ))}
                  </span>
                </div>
              </div>

              {course.price && (
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-gray-300">
                      총 결제 금액
                    </span>
                    <span className="text-xl font-bold text-lime-400">
                      {course.price.toLocaleString()}원
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 개인 정보 입력 단계
  const PersonalInfoStep = () => {
    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium text-white mb-6">기본 정보</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
            {/* 이름(한글) */}
            <div>
              <label
                htmlFor="koreanName"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                이름 (한글) <span className="text-red-400">*</span>
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  id="koreanName"
                  name="koreanName"
                  value={applicationData.koreanName}
                  onChange={handleInputChange}
                  className={`${inputBaseStyle} ${
                    errors.koreanName
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-600 hover:border-lime-400"
                  }`}
                />
                {errors.koreanName && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-red-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
              {errors.koreanName && (
                <p className="mt-2 text-sm text-red-400">{errors.koreanName}</p>
              )}
            </div>

            {/* 이름(영문) */}
            <div>
              <label
                htmlFor="englishName"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                이름 (영문)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="englishName"
                  name="englishName"
                  value={applicationData.englishName}
                  onChange={handleInputChange}
                  className={`${inputBaseStyle} border-gray-600 hover:border-lime-400`}
                />
              </div>
            </div>

            {/* 이메일 */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                이메일 <span className="text-red-400">*</span>
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={applicationData.email}
                  onChange={handleInputChange}
                  className={`${inputBaseStyle} ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-600 hover:border-lime-400"
                  }`}
                />
                {errors.email && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-red-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            {/* 전화번호 */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                전화번호 <span className="text-red-400">*</span>
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={applicationData.phone}
                  onChange={handleInputChange}
                  placeholder="010-0000-0000"
                  className={`${inputBaseStyle} ${
                    errors.phone
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-600 hover:border-lime-400"
                  }`}
                />
                {errors.phone && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-red-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
              {errors.phone && (
                <p className="mt-2 text-sm text-red-400">{errors.phone}</p>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <h3 className="text-lg font-medium text-white mb-6">추가 정보</h3>

          {/* 성별 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              성별 <span className="text-red-400">*</span>
            </label>
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <input
                  id="gender-male"
                  name="gender"
                  type="radio"
                  value="male"
                  checked={applicationData.gender === "male"}
                  onChange={() => handleRadioChange("gender", "male")}
                  className="h-4 w-4 text-lime-500 border-gray-600 bg-gray-700 focus:ring-lime-400 focus:ring-offset-gray-800"
                />
                <label
                  htmlFor="gender-male"
                  className="ml-2 block text-sm text-gray-300"
                >
                  남성
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="gender-female"
                  name="gender"
                  type="radio"
                  value="female"
                  checked={applicationData.gender === "female"}
                  onChange={() => handleRadioChange("gender", "female")}
                  className="h-4 w-4 text-lime-500 border-gray-600 bg-gray-700 focus:ring-lime-400 focus:ring-offset-gray-800"
                />
                <label
                  htmlFor="gender-female"
                  className="ml-2 block text-sm text-gray-300"
                >
                  여성
                </label>
              </div>
            </div>
            {errors.gender && (
              <p className="mt-2 text-sm text-red-400">{errors.gender}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 mb-6">
            {/* 나이 */}
            <div>
              <label
                htmlFor="age"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                나이 <span className="text-red-400">*</span>
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  id="age"
                  name="age"
                  value={applicationData.age}
                  onChange={handleInputChange}
                  className={`${inputBaseStyle} ${
                    errors.age
                      ? "border-red-500 focus:ring-2 focus:ring-red-500"
                      : "border-gray-600 focus:ring-2 focus:ring-lime-500 hover:border-lime-400"
                  } transition-all duration-200`}
                />
                {errors.age && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-red-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
              {errors.age && (
                <p className="mt-2 text-sm text-red-400">{errors.age}</p>
              )}
            </div>

            {/* 직업(소속) */}
            <div>
              <label
                htmlFor="occupation"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                직업(소속) <span className="text-red-400">*</span>
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  id="occupation"
                  name="occupation"
                  value={applicationData.occupation}
                  onChange={handleInputChange}
                  className={`${inputBaseStyle} ${
                    errors.occupation
                      ? "border-red-500 focus:ring-2 focus:ring-red-500"
                      : "border-gray-600 focus:ring-2 focus:ring-lime-500 hover:border-lime-400"
                  } transition-all duration-200`}
                />
                {errors.occupation && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-red-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
              {errors.occupation && (
                <p className="mt-2 text-sm text-red-400">{errors.occupation}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 mb-6">
            {/* 거주지역 */}
            <div>
              <label
                htmlFor="region"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                거주지역 <span className="text-red-400">*</span>
              </label>
              <div className="mt-1">
                <select
                  id="region"
                  name="region"
                  value={applicationData.region}
                  onChange={handleInputChange}
                  className={`${inputBaseStyle} ${
                    errors.region
                      ? "border-red-500 focus:ring-2 focus:ring-red-500"
                      : "border-gray-600 focus:ring-2 focus:ring-lime-500 hover:border-lime-400"
                  } transition-all duration-200`}
                >
                  <option value="">선택해주세요</option>
                  {REGION_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.region && (
                <p className="mt-2 text-sm text-red-400">{errors.region}</p>
              )}
            </div>

            {/* 필라테스 운동기간 */}
            <div>
              <label
                htmlFor="pilatesExperience"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                필라테스 운동기간 <span className="text-red-400">*</span>
              </label>
              <div className="mt-1">
                <select
                  id="pilatesExperience"
                  name="pilatesExperience"
                  value={applicationData.pilatesExperience}
                  onChange={handleInputChange}
                  className={`${inputBaseStyle} ${
                    errors.pilatesExperience
                      ? "border-red-500 focus:ring-2 focus:ring-red-500"
                      : "border-gray-600 focus:ring-2 focus:ring-lime-500 hover:border-lime-400"
                  } transition-all duration-200`}
                >
                  <option value="">선택해주세요</option>
                  {EXPERIENCE_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.pilatesExperience && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.pilatesExperience}
                </p>
              )}
            </div>
          </div>

          {/* 문의사항 */}
          <div>
            <label
              htmlFor="question"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              문의사항
            </label>
            <div className="mt-1">
              <textarea
                id="question"
                name="question"
                rows={4}
                value={applicationData.question}
                onChange={handleInputChange}
                className={`${inputBaseStyle} border-gray-600 focus:ring-2 focus:ring-lime-500 hover:border-lime-400 transition-all duration-200`}
              ></textarea>
            </div>
            <p className="mt-2 text-sm text-gray-400">
              추가 문의사항이나 요청사항이 있으시면 입력해주세요.
            </p>
          </div>
        </div>
      </div>
    );
  };

  // 결제 단계
  const PaymentStep = () => {
    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium text-white mb-6">
            결제 방법 선택
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PAYMENT_METHODS.map((method) => (
              <div
                key={method.id}
                onClick={() => setSelectedPaymentMethod(method.id)}
                className={`
                  relative rounded-lg border overflow-hidden transition-all duration-200 cursor-pointer transform hover:-translate-y-1
                  ${
                    selectedPaymentMethod === method.id
                      ? "border-lime-500 bg-lime-900/30 ring-2 ring-lime-500 shadow-lg shadow-lime-600/20"
                      : "border-gray-700 hover:border-lime-400 bg-gray-800 hover:bg-gray-700"
                  }
                `}
              >
                <label
                  htmlFor={`payment-${method.id}`}
                  className="cursor-pointer h-full w-full p-4 flex flex-col"
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id={`payment-${method.id}`}
                      name="paymentMethod"
                      value={method.id}
                      checked={selectedPaymentMethod === method.id}
                      onChange={() => setSelectedPaymentMethod(method.id)}
                      className="h-4 w-4 text-lime-500 border-gray-600 bg-gray-700 focus:ring-lime-400 focus:ring-offset-gray-800"
                    />
                    <span className="ml-3 font-medium text-white">
                      {method.name}
                    </span>
                  </div>

                  <div className="mt-2 text-sm text-gray-400">
                    {method.id === "onsite" && "강의 당일 현장에서 결제합니다."}
                    {method.id === "card" && "신용카드로 즉시 결제합니다."}
                    {method.id === "transfer" &&
                      "아래 계좌로 입금 후 확인됩니다."}
                  </div>
                </label>

                {selectedPaymentMethod === method.id && (
                  <div className="absolute top-0 right-0 p-1">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-lime-500">
                      <svg
                        className="h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {selectedPaymentMethod === "transfer" && (
          <div className="rounded-md bg-lime-900/30 p-4 border border-lime-800">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-lime-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-lime-300">계좌 정보</h3>
                <div className="mt-2 text-sm text-lime-200">
                  <p className="mb-1">신한은행: 110-123-456789</p>
                  <p className="mb-1">예금주: 바디앤솔 필라테스</p>
                  <p className="font-medium">
                    * 입금 시 신청자 이름으로 입금해 주세요.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-md bg-gray-800 p-6 border border-gray-700">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <h3 className="text-base font-medium text-white mb-2 sm:mb-0">
              결제 금액
            </h3>
            <div className="text-2xl font-bold text-lime-400">
              {course.price
                ? `${course.price.toLocaleString()}원`
                : "문의 요망"}
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-400">
            <p>
              선택하신 결제 방법:{" "}
              {selectedPaymentMethod
                ? PAYMENT_METHODS.find((m) => m.id === selectedPaymentMethod)
                    ?.name
                : "미선택"}
            </p>
          </div>
        </div>
      </div>
    );
  };

  // 확인 단계
  const ConfirmationStep = () => {
    return (
      <div>
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-lime-900/30 mb-6 border border-lime-700">
            <svg
              className="h-12 w-12 text-lime-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            신청이 완료되었습니다
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-8">
            {applicationData.koreanName}님, 과정 신청이 성공적으로
            접수되었습니다. 신청 내용 확인 후 이메일로 추가 안내를 드릴
            예정입니다.
          </p>
        </div>

        <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-800 mb-8">
          <div className="border-b border-gray-700 bg-gray-800/80">
            <div className="px-6 py-4">
              <h3 className="text-lg font-medium text-white">신청 정보 확인</h3>
            </div>
          </div>
          <div className="px-6 py-5">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-400">이름</dt>
                <dd className="mt-1 text-sm text-gray-200">
                  {applicationData.koreanName}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-400">이메일</dt>
                <dd className="mt-1 text-sm text-gray-200">
                  {applicationData.email}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-400">전화번호</dt>
                <dd className="mt-1 text-sm text-gray-200">
                  {applicationData.phone}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-400">성별</dt>
                <dd className="mt-1 text-sm text-gray-200">
                  {applicationData.gender === "male" ? "남성" : "여성"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-400">과정명</dt>
                <dd className="mt-1 text-sm text-gray-200">{course.title}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-400">카테고리</dt>
                <dd className="mt-1 text-sm text-gray-200">
                  {categoryName ||
                    CATEGORY_MAPPING[course.category] ||
                    course.category}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-400">강사</dt>
                <dd className="mt-1 text-sm text-gray-200">
                  {teacherNames.length > 0
                    ? teacherNames.join(", ")
                    : schedule.teachers
                    ? schedule.teachers.join(", ")
                    : ""}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-400">일정</dt>
                <dd className="mt-1 text-sm text-gray-200">
                  {formatDate(schedule.startDate)} ~{" "}
                  {formatDate(schedule.endDate)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-400">결제 방법</dt>
                <dd className="mt-1 text-sm text-gray-200">
                  {
                    PAYMENT_METHODS.find((m) => m.id === selectedPaymentMethod)
                      ?.name
                  }
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-400">금액</dt>
                <dd className="mt-1 text-sm font-bold text-lime-400">
                  {course.price
                    ? `${course.price.toLocaleString()}원`
                    : "문의 요망"}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-lime-600 hover:bg-lime-700 px-6 py-3 text-base font-medium text-white shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-lime-500 transition-all duration-200 transform hover:-translate-y-1"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 text-gray-100">
      <div className="container max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center mb-10">
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
            과정 신청
          </h1>
          <div className="h-1 w-16 bg-lime-500 rounded-full mb-4"></div>
          <p className="text-gray-400 text-center max-w-xl">
            바디앤솔의 교육 과정에 신청해 주셔서 감사합니다. 아래 양식을
            작성하여 등록을 완료해 주세요.
          </p>
        </div>

        <StepIndicator />

        {loading ? (
          <div className="bg-gray-800 rounded-lg shadow-xl p-8 mb-8 border border-gray-700">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-700 rounded-full w-1/4 mb-6"></div>
              <div className="h-64 bg-gray-700 rounded-lg mb-6"></div>
              <div className="h-8 bg-gray-700 rounded-full w-1/2 mb-6"></div>
              <div className="h-8 bg-gray-700 rounded-full w-1/3"></div>
            </div>
          </div>
        ) : error || !course || !schedule ? (
          <div className="bg-gray-800 rounded-lg shadow-xl p-8 mb-8 border border-gray-700">
            <div className="bg-red-900 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-300">
                    {error || "과정 또는 일정 정보를 불러올 수 없습니다."}
                  </p>
                </div>
              </div>
            </div>
            <Link
              href={`/courses/${slug}`}
              className="inline-flex items-center justify-center px-5 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-lime-500 transition-colors duration-200"
            >
              <svg
                className="mr-2 -ml-1 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              과정 정보로 돌아가기
            </Link>
          </div>
        ) : (
          <>
            <CourseInfo />

            <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden mb-10 border border-gray-700 transition-all hover:shadow-2xl">
              <div className="border-b border-gray-700 bg-gray-800/80">
                <div className="px-6 py-5">
                  <h2 className="text-lg font-medium text-white">
                    {step === ApplicationStep.PERSONAL_INFO && "개인 정보 입력"}
                    {step === ApplicationStep.PAYMENT && "결제 방법 선택"}
                    {step === ApplicationStep.CONFIRMATION && "신청 완료"}
                  </h2>
                </div>
              </div>

              <div className="px-6 py-8">
                {step === ApplicationStep.PERSONAL_INFO && <PersonalInfoStep />}
                {step === ApplicationStep.PAYMENT && <PaymentStep />}
                {step === ApplicationStep.CONFIRMATION && <ConfirmationStep />}

                {step !== ApplicationStep.CONFIRMATION && (
                  <div className="flex justify-between mt-12 pt-6 border-t border-gray-700">
                    {step > ApplicationStep.PERSONAL_INFO ? (
                      <button
                        type="button"
                        className="inline-flex items-center px-6 py-3 border border-gray-600 shadow-md text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-lime-500 transition-all duration-200"
                        onClick={handlePrevStep}
                      >
                        <svg
                          className="mr-2 -ml-1 h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        이전
                      </button>
                    ) : (
                      <Link
                        href={`/courses/${slug}`}
                        className="inline-flex items-center px-6 py-3 border border-gray-600 shadow-md text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-lime-500 transition-all duration-200"
                      >
                        취소
                      </Link>
                    )}

                    <button
                      type="button"
                      className="inline-flex items-center px-6 py-3 border border-transparent shadow-md text-sm font-medium rounded-md text-white bg-lime-600 hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-lime-500 transition-all duration-200"
                      onClick={handleNextStep}
                    >
                      {step === ApplicationStep.PAYMENT ? "신청 완료" : "다음"}
                      <svg
                        className="ml-2 -mr-1 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
