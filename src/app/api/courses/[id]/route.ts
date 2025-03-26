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

    // 강좌 정보와 함께 인스트럭터 관계 정보도 가져오기 (any 타입 사용)
    const course = await (prisma as any).course.findUnique({
      where: { id },
      include: {
        courseInstructors: {
          include: {
            teacher: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
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

    // 강좌가 존재하는지 확인 (any 타입 사용)
    const existingCourse = await (prisma as any).course.findUnique({
      where: { id },
      include: {
        courseInstructors: {
          include: {
            teacher: true,
          },
        },
      },
    });

    if (!existingCourse) {
      return NextResponse.json(
        { error: "강좌를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 트랜잭션으로 과정 및 강사 관계 업데이트 (any 타입 사용)
    const result = await (prisma as any).$transaction(async (tx: any) => {
      // 1. 기본 과정 정보 업데이트
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

      // 과정 업데이트
      const updatedCourse = await tx.course.update({
        where: { id },
        data: filteredData,
      });

      // 2. 인스트럭터 관계 관리 (CourseInstructor 테이블)
      if (data.instructors) {
        let instructors = [];

        try {
          // 인스트럭터 데이터 파싱
          instructors =
            typeof data.instructors === "string"
              ? JSON.parse(data.instructors)
              : data.instructors;
        } catch (e) {
          console.error("인스트럭터 데이터 파싱 오류:", e);
          instructors = [];
        }

        if (Array.isArray(instructors)) {
          // 기존 인스트럭터 관계 삭제
          await tx.courseInstructor.deleteMany({
            where: { courseId: id },
          });

          // 새 인스트럭터 관계 생성
          if (instructors.length > 0) {
            for (let i = 0; i < instructors.length; i++) {
              const instructor = instructors[i];
              if (instructor && instructor.id) {
                await tx.courseInstructor.create({
                  data: {
                    courseId: id,
                    teacherId: instructor.id,
                    role: instructor.role || null,
                    order: i,
                  },
                });
              }
            }
          }
        }
      }

      // 업데이트된 과정 정보 반환 (인스트럭터 관계 포함)
      return tx.course.findUnique({
        where: { id },
        include: {
          courseInstructors: {
            include: {
              teacher: true,
            },
            orderBy: {
              order: "asc",
            },
          },
        },
      });
    });

    return NextResponse.json(result);
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
