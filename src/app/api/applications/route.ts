import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// 신청 데이터 검증 스키마
const applicationSchema = z.object({
  courseId: z.string(),
  scheduleId: z.string(),
  koreanName: z.string().min(1, "이름을 입력해주세요."),
  englishName: z.string().optional(),
  email: z.string().email("올바른 이메일 형식이 아닙니다."),
  phone: z.string().min(1, "전화번호를 입력해주세요."),
  gender: z.enum(["male", "female"]),
  age: z.string().min(1, "나이를 입력해주세요."),
  occupation: z.string().min(1, "직업(소속)을 입력해주세요."),
  region: z.string().min(1, "거주지역을 선택해주세요."),
  pilatesExperience: z.string().min(1, "필라테스 운동기간을 선택해주세요."),
  question: z.string().optional(),
  paymentMethod: z.enum(["onsite", "card", "transfer"]),
});

export async function POST(request: NextRequest) {
  try {
    // 요청 본문 파싱
    const body = await request.json();
    
    // 데이터 유효성 검사
    const validationResult = applicationSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: "유효하지 않은 입력입니다.", 
          details: validationResult.error.format() 
        }, 
        { status: 400 }
      );
    }
    
    const applicationData = validationResult.data;
    
    // 실제 데이터베이스 저장 부분은 마이그레이션 후 활성화
    // 현재는 임시로 성공 응답만 반환
    
    // 코스 존재 여부 확인 코드
    /*
    const course = await prisma.course.findUnique({
      where: { id: applicationData.courseId },
    });
    
    if (!course) {
      return NextResponse.json(
        { error: "존재하지 않는 과정입니다." }, 
        { status: 404 }
      );
    }
    
    // 신청 정보 저장
    const application = await prisma.application.create({
      data: {
        courseId: applicationData.courseId,
        scheduleId: applicationData.scheduleId,
        koreanName: applicationData.koreanName,
        englishName: applicationData.englishName || "",
        email: applicationData.email,
        phone: applicationData.phone,
        gender: applicationData.gender,
        age: applicationData.age,
        occupation: applicationData.occupation,
        region: applicationData.region,
        pilatesExperience: applicationData.pilatesExperience,
        question: applicationData.question || "",
        paymentMethod: applicationData.paymentMethod,
        status: "pending", // 기본 상태: 대기 중
      },
    });
    */
    
    // 임시 응답 (실제 DB 저장 없이 성공 응답)
    return NextResponse.json(
      { 
        message: "신청이 성공적으로 접수되었습니다.",
        applicationId: "temp-" + Date.now() // 임시 ID 생성
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error("신청 처리 중 오류 발생:", error);
    return NextResponse.json(
      { error: "신청 처리 중 오류가 발생했습니다." }, 
      { status: 500 }
    );
  }
} 