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
  instructor: z.string().min(1, "강사 이름은 필수입니다.").optional(),
  instructorInfo: z.string().optional(),
  instructorImageUrl: z.string().optional(),
  schedule: z.string().optional(),
  duration: z.string().optional(),
  location: z.string().optional(),
  maxStudents: z.number().optional().nullable(),
  price: z.number().optional().nullable(),
  discountPrice: z.number().optional().nullable(),
  paymentMethods: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

// GET 요청 처리 - 특정 과정 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: params.id },
    });

    if (!course) {
      return NextResponse.json(
        { error: "과정을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error("과정 조회 오류:", error);
    return NextResponse.json(
      { error: "과정을 조회하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// PATCH 요청 처리 - 과정 업데이트
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 세션 확인
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    }

    // 요청 데이터 파싱
    const data = await request.json();

    // 데이터 유효성 검사
    const validationResult = courseUpdateSchema.safeParse(data);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "유효하지 않은 데이터입니다.",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    // 과정 존재 여부 확인
    const existingCourse = await prisma.course.findUnique({
      where: { id: params.id },
    });

    if (!existingCourse) {
      return NextResponse.json(
        { error: "과정을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 슬러그 중복 확인 (슬러그가 변경된 경우에만)
    if (data.slug && data.slug !== existingCourse.slug) {
      const courseWithSameSlug = await prisma.course.findUnique({
        where: { slug: data.slug },
      });

      if (courseWithSameSlug) {
        return NextResponse.json(
          { error: "이미 사용 중인 슬러그입니다. 다른 슬러그를 사용해주세요." },
          { status: 400 }
        );
      }
    }

    // 과정 업데이트
    const updatedCourse = await prisma.course.update({
      where: { id: params.id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.slug && { slug: data.slug }),
        ...(data.description && { description: data.description }),
        ...(data.content && { content: data.content }),
        ...(data.thumbnailUrl && { thumbnailUrl: data.thumbnailUrl }),
        ...(data.thumbnailWidth && { thumbnailWidth: data.thumbnailWidth }),
        ...(data.thumbnailHeight && { thumbnailHeight: data.thumbnailHeight }),
        ...(data.category && { category: data.category }),
        ...(data.instructor && { instructor: data.instructor }),
        ...(data.instructorInfo !== undefined && {
          instructorInfo: data.instructorInfo,
        }),
        ...(data.instructorImageUrl !== undefined && {
          instructorImageUrl: data.instructorImageUrl,
        }),
        ...(data.schedule !== undefined && { schedule: data.schedule }),
        ...(data.duration !== undefined && { duration: data.duration }),
        ...(data.location !== undefined && { location: data.location }),
        ...(data.maxStudents !== undefined && {
          maxStudents: data.maxStudents,
        }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.discountPrice !== undefined && {
          discountPrice: data.discountPrice,
        }),
        ...(data.paymentMethods && { paymentMethods: data.paymentMethods }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error("과정 업데이트 오류:", error);
    return NextResponse.json(
      { error: "과정을 업데이트하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// DELETE 요청 처리 - 과정 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 세션 확인
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    }

    // 과정 존재 여부 확인
    const existingCourse = await prisma.course.findUnique({
      where: { id: params.id },
    });

    if (!existingCourse) {
      return NextResponse.json(
        { error: "과정을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 과정 삭제
    await prisma.course.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("과정 삭제 오류:", error);
    return NextResponse.json(
      { error: "과정을 삭제하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
