"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import React from "react";

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

  // 신청 정보 상태 부분을 uncontrolled 컴포넌트로 변경
  const formRef = React.useRef<HTMLFormElement>(null);

  // 포커스 디버깅을 위한 ref 및 함수
  const koreanNameInputRef = React.useRef<HTMLInputElement | null>(null);

  // 입력 필드 참조를 저장할 객체 - 제네릭 유형 수정
  const inputRefs = React.useRef<
    Record<
      string,
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null
    >
  >({});

  // 마지막 커서 위치를 기억하기 위한 상태 추가
  const [lastCursorPositions, setLastCursorPositions] = React.useState<
    Record<string, number>
  >({});

  // 브라우저 및 환경 정보 저장
  const [isSafari, setIsSafari] = React.useState(false);

  // 브라우저 감지
  React.useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsSafari(/safari/.test(userAgent) && !/chrome/.test(userAgent));
    console.log(`[환경] 브라우저: ${userAgent}`);
    console.log(
      `[환경] Safari 감지: ${
        /safari/.test(userAgent) && !/chrome/.test(userAgent)
      }`
    );

    // 포커스 이벤트 리스너 등록
    const handleDocumentFocusIn = (e: FocusEvent) => {
      console.log(
        `[문서] 포커스인 이벤트: ${(e.target as HTMLElement).tagName}, ID: ${
          (e.target as HTMLElement).id
        }`
      );
    };

    const handleDocumentFocusOut = (e: FocusEvent) => {
      console.log(
        `[문서] 포커스아웃 이벤트: ${(e.target as HTMLElement).tagName}, ID: ${
          (e.target as HTMLElement).id
        }`
      );
    };

    // 전역 이벤트 리스너 등록
    document.addEventListener("focusin", handleDocumentFocusIn);
    document.addEventListener("focusout", handleDocumentFocusOut);

    // 클린업 함수
    return () => {
      document.removeEventListener("focusin", handleDocumentFocusIn);
      document.removeEventListener("focusout", handleDocumentFocusOut);
    };
  }, []);

  // 참조 등록 함수
  const registerRef =
    (name: string) => (el: HTMLInputElement | HTMLTextAreaElement | null) => {
      inputRefs.current[name] = el;
    };

  // IME 조합 상태를 추적하기 위한 변수
  const [isComposing, setIsComposing] = React.useState<Record<string, boolean>>(
    {}
  );

  // 입력 필드 변경 핸들러 수정 - 커서 처리 개선
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    console.log(`[입력] 입력 변경 - 필드: ${name}, 값: ${value}`);
    console.log(`[입력] 현재 조합 중: ${isComposing[name] ? "O" : "X"}`);

    // 현재 입력 요소 저장
    inputRefs.current[name] = e.target as
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement;

    // 텍스트 타입 필드일 경우만 커서 위치 저장
    let cursorPosition = 0;

    try {
      // 입력 요소 타입 확인
      const inputElement = e.target;

      // selectionStart 속성이 있는 요소인지 확인 (HTMLInputElement 또는 HTMLTextAreaElement)
      if (
        "selectionStart" in inputElement &&
        inputElement.selectionStart !== null &&
        (inputElement.type === "text" ||
          inputElement.type === "email" ||
          inputElement.type === "tel" ||
          inputElement.tagName === "TEXTAREA")
      ) {
        cursorPosition = inputElement.selectionStart;
        console.log(`[입력] 현재 커서 위치: ${cursorPosition}`);

        // 마지막 커서 위치 업데이트
        setLastCursorPositions((prev) => ({
          ...prev,
          [name]: cursorPosition,
        }));
      }
    } catch (err) {
      console.error(`[입력] 커서 위치 저장 오류:`, err);
    }

    // 한글 입력 중일 때는 상태 업데이트를 건너뜀 (조합 완료시 처리)
    if (isComposing[name]) {
      console.log(`[입력] 한글 조합 중이므로 상태 업데이트 건너뜀`);
      return;
    }

    // 상태 업데이트
    setApplicationData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 브라우저가 Safari인 경우 1ms 딜레이 추가 (Safari에서 DOM 렌더링 타이밍 이슈)
    const restoreCursor = () => {
      try {
        const element = inputRefs.current[name];

        // selectionRange 메서드를 가진 요소인지 확인
        if (
          element &&
          document.activeElement === element &&
          "setSelectionRange" in element
        ) {
          // 한글 입력이 아닌 경우 현재 포지션으로, 한글 입력인 경우 마지막으로 저장된 위치로 복원
          const position = cursorPosition;
          console.log(`[입력] 커서 위치 복원 시도: ${position}`);

          // 0ms 후 다시 시도 (이벤트 루프의 다음 틱에서 실행)
          setTimeout(() => {
            if (element && document.activeElement === element) {
              element.setSelectionRange(position, position);
              console.log(`[입력] 커서 위치 복원 완료(2차): ${position}`);
            }
          }, 0);
        }
      } catch (err) {
        console.error(`[입력] 커서 위치 복원 오류:`, err);
      }
    };

    if (isSafari) {
      setTimeout(restoreCursor, 1);
    } else {
      window.requestAnimationFrame(restoreCursor);
    }

    // 오류 상태 제거
    if (errors[name as keyof ApplicationData]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof ApplicationData];
        return newErrors;
      });
    }
  };

  // 한글 입력 관련 추가 이벤트 핸들러 수정
  const handleCompositionStart = (
    e: React.CompositionEvent<HTMLInputElement>
  ) => {
    const inputName = (e.target as HTMLInputElement).name || "이름 없음";
    console.log(`[IME] 조합 시작: ${inputName}`);

    // 조합 상태 설정
    setIsComposing((prev) => ({
      ...prev,
      [inputName]: true,
    }));

    // 현재 커서 위치 저장
    try {
      const inputElement = e.target as HTMLInputElement;
      if (inputElement.selectionStart !== null) {
        const selectionStart = inputElement.selectionStart ?? 0;
        setLastCursorPositions((prev) => ({
          ...prev,
          [inputName]: selectionStart,
        }));
        console.log(`[IME] 조합 시작 시 커서 위치 저장: ${selectionStart}`);
      }
    } catch (err) {
      console.error(`[IME] 조합 시작 시 커서 위치 저장 오류:`, err);
    }
  };

  const handleCompositionUpdate = (
    e: React.CompositionEvent<HTMLInputElement>
  ) => {
    const inputName = (e.target as HTMLInputElement).name || "이름 없음";
    console.log(`[IME] 조합 업데이트: ${inputName}, 데이터: ${e.data}`);
  };

  const handleCompositionEnd = (
    e: React.CompositionEvent<HTMLInputElement>
  ) => {
    const inputName = (e.target as HTMLInputElement).name || "이름 없음";
    console.log(`[IME] 조합 완료: ${inputName}, 최종 데이터: ${e.data}`);

    // 입력 요소 참조 저장 (재렌더링 중 참조가 사라지는 것을 방지)
    const currentInput = e.target as HTMLInputElement;
    const originalSelectionStart = currentInput.selectionStart || 0;
    const { name, value } = currentInput;

    // 상태 업데이트
    setApplicationData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 조합 상태 해제 - 약간 지연시켜 처리 (브라우저 간 일관성을 위해)
    setTimeout(() => {
      setIsComposing((prev) => ({
        ...prev,
        [inputName]: false,
      }));

      // 포커스 및 커서 위치 복원
      try {
        if (document.activeElement !== currentInput) {
          console.log(`[IME] 포커스 복원 시도`);
          currentInput.focus();
        }

        // 커서 위치 복원 - 값 길이로 설정
        const position = value.length;
        console.log(`[IME] 조합 후 설정할 커서 위치: ${position}`);

        if (isSafari) {
          setTimeout(() => {
            currentInput.setSelectionRange(position, position);
            console.log(`[IME] Safari 커서 위치 복원: ${position}`);
          }, 10);
        } else {
          requestAnimationFrame(() => {
            currentInput.setSelectionRange(position, position);
            console.log(`[IME] 커서 위치 복원: ${position}`);
          });
        }
      } catch (err) {
        console.error(`[IME] 조합 완료 후 커서 복원 오류:`, err);
      }
    }, 0);
  };

  // 키 이벤트 핸들러
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log(
      `[키] 키 다운: ${e.key}, 코드: ${e.code}, 대상: ${e.currentTarget.name}`
    );
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log(
      `[키] 키 업: ${e.key}, 코드: ${e.code}, 대상: ${e.currentTarget.name}`
    );
  };

  // 기존 포커스 이벤트 핸들러 강화
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    console.log(`[포커스] 포커스 발생: ${e.target.name}`);
    console.log(
      `[포커스] 현재 활성 요소: ${
        document.activeElement === e.target ? "일치" : "불일치"
      }`
    );

    try {
      console.log(`[포커스] 커서 위치: ${e.target.selectionStart}`);

      // 포커스 시 커서를 텍스트 끝으로 이동
      const length = e.target.value.length;
      setTimeout(() => {
        if (document.activeElement === e.target) {
          e.target.setSelectionRange(length, length);
          console.log(`[포커스] 커서 위치 설정: ${length}`);
        }
      }, 0);
    } catch (err) {
      console.error(`[포커스] 커서 위치 설정 오류:`, err);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    console.log(`[포커스] 포커스 해제: ${e.target.name}`);
    console.log(
      `[포커스] 선택 시작: ${e.target.selectionStart}, 선택 끝: ${e.target.selectionEnd}`
    );
    console.log(
      `[포커스] 다음 활성 요소: ${
        document.activeElement
          ? (document.activeElement as HTMLElement).tagName
          : "없음"
      }`
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

  // 제출 중 상태 추가
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 라디오 버튼용 핸들러 복원
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(`[라디오] 변경 - 필드: ${name}, 값: ${value}`);

    setApplicationData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 폼 제출 시 데이터를 수집하는 함수
  const collectFormData = (): ApplicationData => {
    if (!formRef.current) {
      return {
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
      };
    }

    const formData = new FormData(formRef.current);

    return {
      koreanName: (formData.get("koreanName") as string) || "",
      englishName: (formData.get("englishName") as string) || "",
      email: (formData.get("email") as string) || "",
      phone: (formData.get("phone") as string) || "",
      gender: (formData.get("gender") as string) || "",
      age: (formData.get("age") as string) || "",
      occupation: (formData.get("occupation") as string) || "",
      region: (formData.get("region") as string) || "",
      pilatesExperience: (formData.get("pilatesExperience") as string) || "",
      question: (formData.get("question") as string) || "",
    };
  };

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

  // 폼 유효성 검사 수정
  const validateForm = (data: ApplicationData): boolean => {
    const newErrors: Partial<Record<keyof ApplicationData, string>> = {};

    // 필수 필드 검사
    if (!data.koreanName) newErrors.koreanName = "이름(한글)을 입력해주세요.";
    if (!data.email) newErrors.email = "이메일을 입력해주세요.";
    if (!data.phone) newErrors.phone = "전화번호를 입력해주세요.";
    if (!data.gender) newErrors.gender = "성별을 선택해주세요.";
    if (!data.age) newErrors.age = "나이를 입력해주세요.";
    if (!data.occupation) newErrors.occupation = "직업(소속)을 입력해주세요.";
    if (!data.region) newErrors.region = "거주지역을 선택해주세요.";
    if (!data.pilatesExperience)
      newErrors.pilatesExperience = "필라테스 운동기간을 선택해주세요.";

    // 이메일 형식 검사
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.email && !emailPattern.test(data.email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다.";
    }

    // 전화번호 형식 검사 (숫자, - 만 허용)
    const phonePattern = /^[0-9-]+$/;
    if (data.phone && !phonePattern.test(data.phone)) {
      newErrors.phone = "올바른 전화번호 형식이 아닙니다.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 다음 단계로 이동하는 핸들러
  const handleNextStep = () => {
    // 현재 단계에 따른 처리
    if (step === ApplicationStep.PERSONAL_INFO) {
      // 폼 데이터 수집
      const formData = collectFormData();

      // 현재 상태와 폼 데이터 병합 (새로운 입력이 덮어쓰도록)
      const mergedData = {
        ...applicationData,
        ...formData,
      };

      setApplicationData(mergedData);

      if (validateForm(mergedData)) {
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

      // 이미 제출 중이면 중복 요청 방지
      if (isSubmitting) {
        console.log("이미 제출 중입니다.");
        return;
      }

      setIsSubmitting(true);

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

        // 상태 코드가 409인 경우 (중복 신청) - 과정 목록으로 리다이렉트 추가
        if (response.status === 409) {
          alert(errorData.error || "이미 신청한 과정입니다.");
          router.push(`/courses`); // 과정 목록 페이지로 리다이렉트
          return;
        }

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
    } finally {
      setIsSubmitting(false);
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
                    {step >= ApplicationStep.CONFIRMATION && (
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

  // 과정 및 일정 정보 표시
  const CourseInfo = () => {
    return (
      <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {course?.thumbnailUrl && (
              <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
                <div className="aspect-w-16 aspect-h-9 relative rounded-lg overflow-hidden bg-gray-900 border border-gray-700">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </div>
            )}
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-lime-900/50 text-lime-200 border border-lime-700">
                  {categoryName ||
                    (course?.category && CATEGORY_MAPPING[course.category]) ||
                    course?.category}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {course?.title}
              </h3>
              <div className="mt-4 space-y-3 text-sm text-gray-300">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-gray-400"
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
                  </div>
                  <div className="ml-3 text-gray-300">
                    <span>
                      <span className="font-medium text-gray-200">일정:</span>{" "}
                      {schedule && formatDate(schedule.startDate)} ~{" "}
                      {schedule && formatDate(schedule.endDate)}
                    </span>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-gray-400"
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
                  </div>
                  <div className="ml-3 text-gray-300">
                    <span>
                      <span className="font-medium text-gray-200">위치:</span>{" "}
                      {schedule?.location}
                    </span>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                  </div>
                  <div className="ml-3 text-gray-300">
                    <span>
                      <span className="font-medium text-gray-200">강사:</span>{" "}
                      {teacherNames.length > 0
                        ? teacherNames.map((name, index) => (
                            <span key={`name-${index}`}>
                              {name}
                              {index < teacherNames.length - 1 && ", "}
                            </span>
                          ))
                        : schedule?.teachers &&
                          schedule.teachers.map((teacher, index) => (
                            <span key={`teacher-${index}`}>
                              {teacher}
                              {index < schedule.teachers.length - 1 && ", "}
                            </span>
                          ))}
                    </span>
                  </div>
                </div>
              </div>

              {course?.price && (
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-gray-300">
                      금액
                    </span>
                    <span className="text-xl font-bold text-lime-400">
                      {course?.price.toLocaleString()}원
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
    // 폼 제출 핸들러
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      // 폼 데이터 수집
      if (formRef.current) {
        const formData = new FormData(formRef.current);
        const newData = {
          koreanName: (formData.get("koreanName") as string) || "",
          englishName: (formData.get("englishName") as string) || "",
          email: (formData.get("email") as string) || "",
          phone: (formData.get("phone") as string) || "",
          gender: (formData.get("gender") as string) || "",
          age: (formData.get("age") as string) || "",
          occupation: (formData.get("occupation") as string) || "",
          region: (formData.get("region") as string) || "",
          pilatesExperience:
            (formData.get("pilatesExperience") as string) || "",
          question: (formData.get("question") as string) || "",
        };

        // 검증 및 다음 단계로 이동
        if (validateForm(newData)) {
          setApplicationData(newData);
          setStep(ApplicationStep.PAYMENT);
        }
      }
    };

    // 디버깅용 useEffect 추가
    React.useEffect(() => {
      console.log("PersonalInfoStep 렌더링됨", applicationData);

      // 포커스 상태 확인 및 복원
      const activeElement = document.activeElement;
      console.log(
        `[렌더링] 현재 활성 요소:`,
        activeElement ? (activeElement as HTMLElement).tagName : "없음"
      );
    });

    return (
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
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
                  ref={koreanNameInputRef}
                  defaultValue={applicationData.koreanName}
                  placeholder="이름을 입력하세요"
                  className={`block w-full rounded-md border ${
                    errors.koreanName ? "border-red-500" : "border-gray-600"
                  } bg-gray-700 text-gray-100 px-3 py-2`}
                  autoComplete="off"
                />
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
                  defaultValue={applicationData.englishName}
                  placeholder="영문 이름을 입력하세요"
                  className="block w-full rounded-md border border-gray-600 bg-gray-700 text-gray-100 px-3 py-2"
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
                  defaultValue={applicationData.email}
                  placeholder="example@email.com"
                  className={`block w-full rounded-md border ${
                    errors.email ? "border-red-500" : "border-gray-600"
                  } bg-gray-700 text-gray-100 px-3 py-2`}
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
                  defaultValue={applicationData.phone}
                  placeholder="010-0000-0000"
                  className={`block w-full rounded-md border ${
                    errors.phone ? "border-red-500" : "border-gray-600"
                  } bg-gray-700 text-gray-100 px-3 py-2`}
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
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label
                htmlFor="gender-male"
                className="text-sm font-medium text-white flex items-center"
              >
                <input
                  id="gender-male"
                  name="gender"
                  type="radio"
                  value="male"
                  defaultChecked={applicationData.gender === "male"}
                  className="h-4 w-4 text-lime-500 border-gray-600 bg-gray-700 focus:ring-lime-400 focus:ring-offset-gray-800"
                />
                <span className="ml-2">남성</span>
              </label>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="gender-female"
                className="text-sm font-medium text-white flex items-center"
              >
                <input
                  id="gender-female"
                  name="gender"
                  type="radio"
                  value="female"
                  defaultChecked={applicationData.gender === "female"}
                  className="h-4 w-4 text-lime-500 border-gray-600 bg-gray-700 focus:ring-lime-400 focus:ring-offset-gray-800"
                />
                <span className="ml-2">여성</span>
              </label>
            </div>
            {errors.gender && (
              <p className="col-span-2 mt-2 text-sm text-red-400">
                {errors.gender}
              </p>
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
                  defaultValue={applicationData.age}
                  placeholder="나이를 입력하세요"
                  className={`block w-full rounded-md border ${
                    errors.age ? "border-red-500" : "border-gray-600"
                  } bg-gray-700 text-gray-100 px-3 py-2`}
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
                  defaultValue={applicationData.occupation}
                  placeholder="직업 또는 소속을 입력하세요"
                  className={`block w-full rounded-md border ${
                    errors.occupation ? "border-red-500" : "border-gray-600"
                  } bg-gray-700 text-gray-100 px-3 py-2`}
                />
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
                  defaultValue={applicationData.region}
                  className={`block w-full rounded-md border ${
                    errors.region ? "border-red-500" : "border-gray-600"
                  } bg-gray-700 text-gray-100 px-3 py-2`}
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
                  defaultValue={applicationData.pilatesExperience}
                  className={`block w-full rounded-md border ${
                    errors.pilatesExperience
                      ? "border-red-500"
                      : "border-gray-600"
                  } bg-gray-700 text-gray-100 px-3 py-2`}
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
                defaultValue={applicationData.question}
                placeholder="문의사항이 있으시면 입력해주세요"
                className={`block w-full rounded-md border ${
                  errors.question ? "border-red-500" : "border-gray-600"
                } bg-gray-700 text-gray-100 px-3 py-2`}
              ></textarea>
            </div>
            <p className="mt-2 text-sm text-gray-400">
              추가 문의사항이나 요청사항이 있으시면 입력해주세요.
            </p>
          </div>
        </div>

        <div className="flex justify-between mt-12 pt-6 border-t border-gray-700">
          <Link
            href={`/courses/${slug}`}
            className="inline-flex items-center px-6 py-3 border border-gray-600 shadow-md text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-lime-500 transition-all duration-200"
          >
            취소
          </Link>

          <button
            type="submit"
            className="inline-flex items-center px-6 py-3 border border-transparent shadow-md text-sm font-medium rounded-md text-white bg-lime-600 hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-lime-500 transition-all duration-200"
          >
            다음
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
      </form>
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
              {course?.price
                ? `${course?.price.toLocaleString()}원`
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
        <div className="max-w-md mx-auto rounded-lg overflow-hidden shadow-xl bg-gradient-to-r from-lime-900/40 to-lime-700/30 border border-lime-700/50 p-6 transform hover:-translate-y-1 transition-all duration-300">
          <div className="text-center mb-8">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-lime-600 text-white">
              <svg
                className="h-10 w-10"
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
            </div>
            <h3 className="mt-4 text-xl font-semibold text-white">신청 완료</h3>
            <div className="text-2xl font-bold text-lime-400">
              {course?.price
                ? `${course?.price.toLocaleString()}원`
                : "문의 요망"}
            </div>
          </div>
          <div className="text-sm text-gray-300 space-y-2">
            <p>
              선택하신 결제 방법:{" "}
              {selectedPaymentMethod
                ? PAYMENT_METHODS.find((m) => m.id === selectedPaymentMethod)
                    ?.name
                : "미선택"}
            </p>
            <p>
              신청자: {applicationData.koreanName} (
              {applicationData.englishName || "미입력"})
            </p>
            <p>
              메일: {applicationData.email} / 전화: {applicationData.phone}
            </p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-lg mt-8 overflow-hidden">
          <div className="border-b border-gray-700 bg-gray-800/80 px-6 py-4">
            <h2 className="text-lg font-medium text-white">신청 정보 확인</h2>
          </div>
          <div className="p-6">
            <dl className="grid grid-cols-2 gap-x-4 gap-y-6 text-sm">
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
                <dd className="mt-1 text-sm text-gray-200">{course?.title}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-400">카테고리</dt>
                <dd className="mt-1 text-sm text-gray-200">
                  {categoryName ||
                    (course?.category && CATEGORY_MAPPING[course.category]) ||
                    course?.category}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-400">강사</dt>
                <dd className="mt-1 text-sm text-gray-200">
                  {teacherNames.length > 0
                    ? teacherNames.join(", ")
                    : schedule?.teachers
                    ? schedule.teachers.join(", ")
                    : ""}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-400">일정</dt>
                <dd className="mt-1 text-sm text-gray-200">
                  {schedule && formatDate(schedule.startDate)} ~{" "}
                  {schedule && formatDate(schedule.endDate)}
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
                  {course?.price
                    ? `${course?.price.toLocaleString()}원`
                    : "문의 요망"}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="flex justify-between mt-12 pt-6 border-t border-gray-700">
          <button
            type="button"
            onClick={handlePrevStep}
            className="inline-flex items-center justify-center rounded-md border border-gray-600 bg-gray-700 px-6 py-3 text-base font-medium text-gray-300 shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-lime-500 transition-all duration-200"
          >
            이전
          </button>
          <Link
            href={`/courses/${slug}`}
            className="inline-flex items-center px-6 py-3 border border-transparent shadow-md text-sm font-medium rounded-md text-white bg-lime-600 hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-lime-500 transition-all duration-200"
          >
            과정 목록으로
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
          </Link>
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
                      d="M10 18a8 8 0 11-16 0 8 8 0 0116 0zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
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

                {step === ApplicationStep.PAYMENT && (
                  <div className="flex justify-between mt-12 pt-6 border-t border-gray-700">
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
                          d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      이전
                    </button>

                    <button
                      type="button"
                      onClick={handleNextStep}
                      disabled={isSubmitting || !selectedPaymentMethod}
                      className={`inline-flex items-center px-6 py-3 border border-transparent shadow-md text-sm font-medium rounded-md text-white ${
                        isSubmitting
                          ? "bg-gray-500 cursor-not-allowed"
                          : !selectedPaymentMethod
                          ? "bg-gray-600 cursor-not-allowed"
                          : "bg-lime-600 hover:bg-lime-700"
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-lime-500 transition-all duration-200`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          처리중...
                        </>
                      ) : (
                        <>
                          신청 완료
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
                        </>
                      )}
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
