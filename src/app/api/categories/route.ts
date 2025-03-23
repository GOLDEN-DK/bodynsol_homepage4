import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET - 카테고리 목록 조회
export async function GET(request: NextRequest) {
  try {
    // 교육 카테고리 테이블을 사용하여 조회
    const categories = await prisma.eduCategory.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("카테고리 조회 오류:", error);
    return NextResponse.json(
      { error: "카테고리 목록을 가져오는데 실패했습니다." },
      { status: 500 }
    );
  }
}

// POST - 새 카테고리 생성
export async function POST(request: NextRequest) {
  try {
    // 세션 확인 (관리자만 접근 가능)
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { error: "권한이 없습니다." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, slug, description, isActive = true } = body;

    // 필수 필드 검증
    if (!name || !slug) {
      return NextResponse.json(
        { error: "이름과 슬러그는 필수 항목입니다." },
        { status: 400 }
      );
    }

    // 중복 검사
    const existingCategory = await prisma.eduCategory.findFirst({
      where: {
        OR: [
          { name },
          { slug },
        ],
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "이미 동일한 이름 또는 슬러그의 카테고리가 존재합니다." },
        { status: 400 }
      );
    }

    // 카테고리 생성
    const newCategory = await prisma.eduCategory.create({
      data: {
        name,
        slug,
        description,
        isActive,
      },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("카테고리 생성 오류:", error);
    return NextResponse.json(
      { error: "카테고리 생성에 실패했습니다." },
      { status: 500 }
    );
  }
} 