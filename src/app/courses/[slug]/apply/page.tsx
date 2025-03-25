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

export default function CourseApplication() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params?.slug as string;
  const scheduleId = searchParams.get("scheduleId");
  
  const [step, setStep] = useState<ApplicationStep>(ApplicationStep.PERSONAL_INFO);
  const [course, setCourse] = useState<Course | null>(null);
  const [schedule, setSchedule] = useState<ScheduleItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  
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
  const [errors, setErrors] = useState<Partial<Record<keyof ApplicationData, string>>>({});
  
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
        setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [slug, scheduleId]);
  
  // 입력 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
    if (!applicationData.koreanName) newErrors.koreanName = "이름(한글)을 입력해주세요.";
    if (!applicationData.email) newErrors.email = "이메일을 입력해주세요.";
    if (!applicationData.phone) newErrors.phone = "전화번호를 입력해주세요.";
    if (!applicationData.gender) newErrors.gender = "성별을 선택해주세요.";
    if (!applicationData.age) newErrors.age = "나이를 입력해주세요.";
    if (!applicationData.occupation) newErrors.occupation = "직업(소속)을 입력해주세요.";
    if (!applicationData.region) newErrors.region = "거주지역을 선택해주세요.";
    if (!applicationData.pilatesExperience) newErrors.pilatesExperience = "필라테스 운동기간을 선택해주세요.";
    
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
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
      alert(error instanceof Error ? error.message : "신청 처리 중 오류가 발생했습니다.");
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
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
        </div>
      </div>
    );
  }
  
  if (error || !course || !schedule) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error || "과정 또는 일정 정보를 불러올 수 없습니다."}</p>
        </div>
        <Link
          href={`/courses/${slug}`}
          className="text-blue-600 hover:text-blue-800"
        >
          &larr; 과정 정보로 돌아가기
        </Link>
      </div>
    );
  }

  // 진행 단계 인디케이터
  const StepIndicator = () => {
    return (
      <div className="flex justify-center items-center mb-8">
        <div className="flex items-center">
          <div className={`rounded-full h-10 w-10 flex items-center justify-center ${
            step >= ApplicationStep.PERSONAL_INFO ? "bg-blue-600 text-white" : "bg-gray-300"
          }`}>
            1
          </div>
          <div className={`h-1 w-12 ${
            step > ApplicationStep.PERSONAL_INFO ? "bg-blue-600" : "bg-gray-300"
          }`}></div>
          <div className={`rounded-full h-10 w-10 flex items-center justify-center ${
            step >= ApplicationStep.PAYMENT ? "bg-blue-600 text-white" : "bg-gray-300"
          }`}>
            2
          </div>
          <div className={`h-1 w-12 ${
            step > ApplicationStep.PAYMENT ? "bg-blue-600" : "bg-gray-300"
          }`}></div>
          <div className={`rounded-full h-10 w-10 flex items-center justify-center ${
            step >= ApplicationStep.CONFIRMATION ? "bg-blue-600 text-white" : "bg-gray-300"
          }`}>
            3
          </div>
        </div>
      </div>
    );
  };

  // 과정 및 일정 정보 표시
  const CourseInfo = () => {
    return (
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">신청 과정 정보</h2>
        <div className="flex flex-col md:flex-row mb-4">
          {course.thumbnailUrl && (
            <div className="mr-4 mb-4 md:mb-0">
              <Image
                src={course.thumbnailUrl}
                alt={course.title}
                width={120}
                height={80}
                className="object-cover rounded"
              />
            </div>
          )}
          <div>
            <h3 className="font-bold text-xl">{course.title}</h3>
            <p className="text-gray-600">{course.category}</p>
            <p className="mt-2">
              <span className="font-semibold">일정: </span>
              {formatDate(schedule.startDate)} ~ {formatDate(schedule.endDate)}
            </p>
            <p>
              <span className="font-semibold">위치: </span>
              {schedule.location}
            </p>
            <p>
              <span className="font-semibold">강사: </span>
              {schedule.teachers.join(", ")}
            </p>
            {course.price && (
              <p className="mt-2 text-lg font-bold">
                가격: {course.price.toLocaleString()}원
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // 개인 정보 입력 단계
  const PersonalInfoStep = () => {
    return (
      <div>
        <h2 className="text-xl font-bold mb-6">개인 정보 입력</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* 이름(한글) */}
          <div>
            <label htmlFor="koreanName" className="block text-sm font-medium text-gray-700 mb-1">
              이름 (한글) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="koreanName"
              name="koreanName"
              value={applicationData.koreanName}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded ${
                errors.koreanName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.koreanName && (
              <p className="mt-1 text-sm text-red-600">{errors.koreanName}</p>
            )}
          </div>
          
          {/* 이름(영문) */}
          <div>
            <label htmlFor="englishName" className="block text-sm font-medium text-gray-700 mb-1">
              이름 (영문)
            </label>
            <input
              type="text"
              id="englishName"
              name="englishName"
              value={applicationData.englishName}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          
          {/* 이메일 */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              이메일 <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={applicationData.email}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>
          
          {/* 전화번호 */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              전화번호 <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={applicationData.phone}
              onChange={handleInputChange}
              placeholder="010-0000-0000"
              className={`w-full p-2 border rounded ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>
        </div>
        
        {/* 성별 */}
        <div className="mb-6">
          <p className="block text-sm font-medium text-gray-700 mb-2">
            성별 <span className="text-red-500">*</span>
          </p>
          <div className="flex gap-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="gender-male"
                name="gender"
                value="male"
                checked={applicationData.gender === "male"}
                onChange={() => handleRadioChange("gender", "male")}
                className="mr-2"
              />
              <label htmlFor="gender-male">남성</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="gender-female"
                name="gender"
                value="female"
                checked={applicationData.gender === "female"}
                onChange={() => handleRadioChange("gender", "female")}
                className="mr-2"
              />
              <label htmlFor="gender-female">여성</label>
            </div>
          </div>
          {errors.gender && (
            <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* 나이 */}
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
              나이 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="age"
              name="age"
              value={applicationData.age}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded ${
                errors.age ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.age && (
              <p className="mt-1 text-sm text-red-600">{errors.age}</p>
            )}
          </div>
          
          {/* 직업(소속) */}
          <div>
            <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 mb-1">
              직업(소속) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="occupation"
              name="occupation"
              value={applicationData.occupation}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded ${
                errors.occupation ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.occupation && (
              <p className="mt-1 text-sm text-red-600">{errors.occupation}</p>
            )}
          </div>
        </div>
        
        {/* 거주지역 */}
        <div className="mb-6">
          <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
            거주지역 <span className="text-red-500">*</span>
          </label>
          <select
            id="region"
            name="region"
            value={applicationData.region}
            onChange={handleInputChange}
            className={`w-full p-2 border rounded ${
              errors.region ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">선택해주세요</option>
            {REGION_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
          {errors.region && (
            <p className="mt-1 text-sm text-red-600">{errors.region}</p>
          )}
        </div>
        
        {/* 필라테스 운동기간 */}
        <div className="mb-6">
          <label htmlFor="pilatesExperience" className="block text-sm font-medium text-gray-700 mb-1">
            필라테스 운동기간 <span className="text-red-500">*</span>
          </label>
          <select
            id="pilatesExperience"
            name="pilatesExperience"
            value={applicationData.pilatesExperience}
            onChange={handleInputChange}
            className={`w-full p-2 border rounded ${
              errors.pilatesExperience ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">선택해주세요</option>
            {EXPERIENCE_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
          {errors.pilatesExperience && (
            <p className="mt-1 text-sm text-red-600">{errors.pilatesExperience}</p>
          )}
        </div>
        
        {/* 문의사항 */}
        <div className="mb-6">
          <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
            문의사항
          </label>
          <textarea
            id="question"
            name="question"
            value={applicationData.question}
            onChange={handleInputChange}
            rows={4}
            className="w-full p-2 border border-gray-300 rounded"
          ></textarea>
        </div>
      </div>
    );
  };

  // 결제 단계
  const PaymentStep = () => {
    return (
      <div>
        <h2 className="text-xl font-bold mb-6">결제 방법 선택</h2>
        
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PAYMENT_METHODS.map((method) => (
              <div
                key={method.id}
                className={`border p-4 rounded cursor-pointer ${
                  selectedPaymentMethod === method.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300"
                }`}
                onClick={() => setSelectedPaymentMethod(method.id)}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    id={`payment-${method.id}`}
                    name="paymentMethod"
                    value={method.id}
                    checked={selectedPaymentMethod === method.id}
                    onChange={() => setSelectedPaymentMethod(method.id)}
                    className="mr-2"
                  />
                  <label htmlFor={`payment-${method.id}`}>{method.name}</label>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {selectedPaymentMethod === "transfer" && (
          <div className="bg-gray-50 p-4 rounded mb-6">
            <h3 className="font-semibold mb-2">계좌 정보</h3>
            <p>신한은행: 110-123-456789</p>
            <p>예금주: 바디앤솔 필라테스</p>
            <p className="mt-2 text-sm text-gray-600">
              * 입금 시 신청자 이름으로 입금해 주세요.
            </p>
          </div>
        )}
        
        <div className="bg-gray-50 p-4 rounded mb-6">
          <h3 className="font-semibold mb-2">결제 금액</h3>
          <p className="text-xl font-bold">{course.price ? `${course.price.toLocaleString()}원` : "문의 요망"}</p>
        </div>
      </div>
    );
  };
  
  // 확인 단계
  const ConfirmationStep = () => {
    return (
      <div className="text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-green-100 text-green-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">신청이 완료되었습니다</h2>
          <p className="text-gray-600 mb-6">
            {applicationData.koreanName}님, 과정 신청이 성공적으로 접수되었습니다.
            <br />
            신청 내용 확인 후 이메일을 통해 안내 드리겠습니다.
          </p>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg mb-6 text-left max-w-md mx-auto">
          <h3 className="font-semibold mb-4">신청 정보</h3>
          <div className="space-y-2">
            <p><span className="font-medium">이름:</span> {applicationData.koreanName}</p>
            <p><span className="font-medium">이메일:</span> {applicationData.email}</p>
            <p><span className="font-medium">전화번호:</span> {applicationData.phone}</p>
            <p><span className="font-medium">과정:</span> {course.title}</p>
            <p><span className="font-medium">일정:</span> {formatDate(schedule.startDate)} ~ {formatDate(schedule.endDate)}</p>
            <p><span className="font-medium">결제방법:</span> {PAYMENT_METHODS.find(m => m.id === selectedPaymentMethod)?.name}</p>
          </div>
        </div>
        
        <div>
          <button
            type="button"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => router.push("/")}
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">과정 신청</h1>
      
      <StepIndicator />
      
      <CourseInfo />
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        {step === ApplicationStep.PERSONAL_INFO && <PersonalInfoStep />}
        {step === ApplicationStep.PAYMENT && <PaymentStep />}
        {step === ApplicationStep.CONFIRMATION && <ConfirmationStep />}
        
        {step !== ApplicationStep.CONFIRMATION && (
          <div className="flex justify-between mt-8">
            {step > ApplicationStep.PERSONAL_INFO ? (
              <button
                type="button"
                className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50"
                onClick={handlePrevStep}
              >
                이전
              </button>
            ) : (
              <Link
                href={`/courses/${slug}`}
                className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                취소
              </Link>
            )}
            
            <button
              type="button"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={handleNextStep}
            >
              {step === ApplicationStep.PAYMENT ? "신청 완료" : "다음"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 