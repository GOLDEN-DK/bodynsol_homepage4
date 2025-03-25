import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// slug를 통해 특정 과정 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;

    if (!slug) {
      return NextResponse.json(
        { error: "슬러그가 필요합니다." },
        { status: 400 }
      );
    }

    // slug로 조회(findFirst 사용)
    const course = await prisma.course.findFirst({
      where: { 
        slug: slug 
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