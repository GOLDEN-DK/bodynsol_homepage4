import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET - 모든 강사 목록 조회
export async function GET(request: NextRequest) {
  try {
    const teachers = await prisma.$queryRaw`
      SELECT id, name, bio, "profileImage", "isActive", "createdAt", "updatedAt"
      FROM edu_teacher
      ORDER BY name ASC
    `;

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
    const newTeacher = await prisma.$queryRaw`
      INSERT INTO edu_teacher (
        id, name, bio, experience, certifications, "profileImage", "isActive", "createdAt", "updatedAt"
      )
      VALUES (
        ${crypto.randomUUID()},
        ${name},
        ${bio || null},
        ${experience || null},
        ${certifications || null},
        ${profileImage || null},
        ${isActive},
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      )
      RETURNING id, name, bio, experience, certifications, "profileImage", "isActive", "createdAt", "updatedAt"
    `;

    return NextResponse.json((newTeacher as any[])[0], { status: 201 });
  } catch (error) {
    console.error("강사 생성 오류:", error);
    return NextResponse.json(
      { error: "강사 생성에 실패했습니다." },
      { status: 500 }
    );
  }
} 