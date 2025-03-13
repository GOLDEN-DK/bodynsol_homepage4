import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

// 과정 스키마 정의
const courseSchema = z.object({
  title: z.string().min(1, "제목은 필수입니다."),
  slug: z.string().min(1, "슬러그는 필수입니다."),
  description: z.string().min(1, "간단한 소개는 필수입니다."),
  content: z.string().min(1, "상세 내용은 필수입니다."),
  thumbnailUrl: z.string().min(1, "썸네일 이미지는 필수입니다."),
  thumbnailWidth: z.number().optional(),
  thumbnailHeight: z.number().optional(),
  category: z.string().min(1, "카테고리는 필수입니다."),
  instructor: z.string().min(1, "강사 이름은 필수입니다."),
  instructorInfo: z.string().optional(),
  instructorImageUrl: z.string().optional(),
  schedule: z.string().optional(),
  duration: z.string().optional(),
  location: z.string().optional(),
  maxStudents: z.number().optional().nullable(),
  price: z.number().optional().nullable(),
  discountPrice: z.number().optional().nullable(),
  paymentMethods: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
});

// GET 요청 처리 - 모든 과정 조회
export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error("과정 조회 오류:", error);
    return NextResponse.json(
      { error: "과정을 조회하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// POST 요청 처리 - 새 과정 추가
export async function POST(request: NextRequest) {
  try {
    // 세션 확인
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    }

    // 요청 데이터 파싱
    const data = await request.json();

    // 데이터 유효성 검사
    const validationResult = courseSchema.safeParse(data);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "유효하지 않은 데이터입니다.",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    // 슬러그 중복 확인
    const existingCourse = await prisma.course.findUnique({
      where: { slug: data.slug },
    });

    if (existingCourse) {
      return NextResponse.json(
        { error: "이미 사용 중인 슬러그입니다. 다른 슬러그를 사용해주세요." },
        { status: 400 }
      );
    }

    // 과정 생성
    const course = await prisma.course.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        content: data.content,
        thumbnailUrl: data.thumbnailUrl,
        thumbnailWidth: data.thumbnailWidth || 800,
        thumbnailHeight: data.thumbnailHeight || 600,
        category: data.category,
        instructor: data.instructor,
        instructorInfo: data.instructorInfo || null,
        instructorImageUrl: data.instructorImageUrl || null,
        schedule: data.schedule || null,
        duration: data.duration || null,
        location: data.location || null,
        maxStudents: data.maxStudents || null,
        price: data.price || null,
        discountPrice: data.discountPrice || null,
        paymentMethods: data.paymentMethods || [],
        isActive: data.isActive,
      },
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error("과정 추가 오류:", error);
    return NextResponse.json(
      { error: "과정을 추가하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
