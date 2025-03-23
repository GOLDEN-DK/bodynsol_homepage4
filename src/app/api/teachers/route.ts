import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET - 모든 강사 목록 조회
export async function GET(request: NextRequest) {
  try {
    const teachers = await prisma.teacher.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        bio: true,
        profileImage: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(teachers);
  } catch (error) {
    console.error("강사 목록 조회 오류:", error);
    return NextResponse.json(
      { error: "강사 목록을 가져오는데 실패했습니다." },
      { status: 500 }
    );
  }
}

// POST - 새 강사 추가
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
    const { name, bio, experience, certifications, profileImage, isActive = true } = body;

    // 필수 필드 검증
    if (!name) {
      return NextResponse.json(
        { error: "이름은 필수 항목입니다." },
        { status: 400 }
      );
    }

    // 강사 생성
    const newTeacher = await prisma.teacher.create({
      data: {
        name,
        bio: bio || null,
        experience: experience || null,
        certifications: certifications || null,
        profileImage: profileImage || null,
        isActive,
      },
    });

    return NextResponse.json(newTeacher, { status: 201 });
  } catch (error) {
    console.error("강사 생성 오류:", error);
    return NextResponse.json(
      { error: "강사 생성에 실패했습니다." },
      { status: 500 }
    );
  }
} 