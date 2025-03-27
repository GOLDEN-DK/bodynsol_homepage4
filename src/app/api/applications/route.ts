import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

// 신청 목록 조회 (GET)
export async function GET() {
  try {
    // 세션 확인 (관리자만 접근 가능)
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 모든 신청 정보 조회
    const applications = await prisma.application.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

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
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const applicationData = validationResult.data;

    // 코스 존재 여부 확인
    const course = await prisma.course.findUnique({
      where: { id: applicationData.courseId },
    });

    if (!course) {
      return NextResponse.json(
        { error: "존재하지 않는 과정입니다." },
        { status: 404 }
      );
    }

    // 중복 신청 여부 확인
    const existingApplication = await prisma.application.findFirst({
      where: {
        AND: [
          { courseId: applicationData.courseId },
          { scheduleId: applicationData.scheduleId },
          {
            OR: [
              { email: applicationData.email },
              { phone: applicationData.phone },
            ],
          },
        ],
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        {
          error:
            "이미 신청한 과정입니다. 동일한 이메일 또는 전화번호로 같은 과정과 일정에 중복 신청이 불가합니다.",
        },
        { status: 409 } // 409 Conflict
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
        price: course.price || null, // 코스 가격 저장
      },
    });

    // 실제 DB 저장 후 응답
    return NextResponse.json(
      {
        message: "신청이 성공적으로 접수되었습니다.",
        applicationId: application.id,
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
