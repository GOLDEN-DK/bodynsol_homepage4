import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

// 과정 업데이트 스키마 정의
const courseUpdateSchema = z.object({
  title: z.string().min(1, "제목은 필수입니다.").optional(),
  slug: z.string().min(1, "슬러그는 필수입니다.").optional(),
  description: z.string().min(1, "간단한 소개는 필수입니다.").optional(),
  content: z.string().min(1, "상세 내용은 필수입니다.").optional(),
  thumbnailUrl: z.string().min(1, "썸네일 이미지는 필수입니다.").optional(),
  thumbnailWidth: z.number().optional(),
  thumbnailHeight: z.number().optional(),
  category: z.string().min(1, "카테고리는 필수입니다.").optional(),
  instructor: z.string().optional(),
  instructorInfo: z.string().optional(),
  instructorImageUrl: z.string().optional(),
  instructors: z.string().optional(),
  schedule: z.string().optional(),
  duration: z.string().optional(),
  location: z.string().optional(),
  maxStudents: z.number().optional().nullable(),
  price: z.number().optional().nullable(),
  discountPrice: z.number().optional().nullable(),
  paymentMethods: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  target: z.string().optional(),
});

// GET 요청 처리 - 특정 과정 조회
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const paramValues = await params;
    const id = paramValues.id;

    const course = await prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      return NextResponse.json(
        { error: "강좌를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error("강좌 조회 오류:", error);
    return NextResponse.json(
      { error: "강좌 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// PATCH 요청 처리 - 과정 업데이트
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // 세션 디버깅 정보
    console.log("세션 정보:", session);

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    }

    const paramValues = await params;
    const id = paramValues.id;
    const data = await request.json();

    console.log("받은 데이터:", data);

    // 강좌가 존재하는지 확인
    const existingCourse = await prisma.course.findUnique({
      where: { id },
    });

    if (!existingCourse) {
      return NextResponse.json(
        { error: "강좌를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 인스트럭터 데이터 처리 - schedule 필드 내에 저장 (임시 해결책)
    let instructorsData = null;
    if (data.instructors) {
      instructorsData =
        typeof data.instructors === "string"
          ? data.instructors
          : JSON.stringify(data.instructors);
    }

    // 기본 필드 업데이트
    const updateData = {
      title: data.title,
      description: data.description,
      thumbnailUrl: data.thumbnailUrl,
      thumbnailWidth: data.thumbnailWidth,
      thumbnailHeight: data.thumbnailHeight,
      category: data.category || data.categoryId,
      curriculum: data.curriculum || data.content,
      schedule: data.schedule,
      price: data.price !== undefined ? data.price : undefined,
      isActive: data.isActive !== undefined ? data.isActive : undefined,
      slug: data.slug,
      target: data.target,
    };

    // undefined 값 제거
    const filteredData = Object.fromEntries(
      Object.entries(updateData).filter(([_, v]) => v !== undefined)
    );

    console.log("업데이트 데이터:", filteredData);

    // 데이터 업데이트 - 인스트럭터 데이터도 별도로 저장 (임시 방식)
    if (instructorsData) {
      try {
        // 별도의 코드로 인스트럭터 정보 저장 (예: 데이터베이스 직접 쿼리)
        console.log("인스트럭터 데이터 (추후 처리 예정):", instructorsData);

        // 여기서 나중에 course_instructor 테이블을 직접 사용하는 코드로 변경 예정
      } catch (error) {
        console.error("인스트럭터 정보 저장 오류:", error);
      }
    }

    // 데이터 업데이트
    const updatedCourse = await prisma.course.update({
      where: { id },
      data: filteredData,
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error("강좌 업데이트 오류:", error);
    return NextResponse.json(
      {
        error:
          "강좌 업데이트 중 오류가 발생했습니다." +
          (error instanceof Error ? `: ${error.message}` : ""),
      },
      { status: 500 }
    );
  }
}

// DELETE 요청 처리 - 과정 삭제
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    }

    const paramValues = await params;
    const id = paramValues.id;

    // 강좌가 존재하는지 확인
    const existingCourse = await prisma.course.findUnique({
      where: { id },
    });

    if (!existingCourse) {
      return NextResponse.json(
        { error: "강좌를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    await prisma.course.delete({
      where: { id },
    });

    return NextResponse.json({ message: "강좌가 삭제되었습니다." });
  } catch (error) {
    console.error("강좌 삭제 오류:", error);
    return NextResponse.json(
      {
        error:
          "강좌 삭제 중 오류가 발생했습니다." +
          (error instanceof Error ? `: ${error.message}` : ""),
      },
      { status: 500 }
    );
  }
}
