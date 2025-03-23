import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET - 특정 강사 정보 조회
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const paramValues = await params;
    const id = paramValues.id;

    const teacher = await prisma.teacher.findUnique({
      where: { id }
    });

    if (!teacher) {
      return NextResponse.json(
        { error: "강사를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json(teacher);
  } catch (error) {
    console.error("강사 조회 오류:", error);
    return NextResponse.json(
      { error: "강사 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// PATCH - 강사 정보 업데이트
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { error: "권한이 없습니다." },
        { status: 403 }
      );
    }

    const paramValues = await params;
    const id = paramValues.id;
    const data = await request.json();

    // 강사가 존재하는지 확인
    const existingTeacher = await prisma.teacher.findUnique({
      where: { id }
    });

    if (!existingTeacher) {
      return NextResponse.json(
        { error: "강사를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const updatedTeacher = await prisma.teacher.update({
      where: { id },
      data
    });

    return NextResponse.json(updatedTeacher);
  } catch (error) {
    console.error("강사 업데이트 오류:", error);
    return NextResponse.json(
      { error: "강사 업데이트 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// DELETE - 강사 삭제
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { error: "권한이 없습니다." },
        { status: 403 }
      );
    }

    const paramValues = await params;
    const id = paramValues.id;

    // 강사가 존재하는지 확인
    const existingTeacher = await prisma.teacher.findUnique({
      where: { id }
    });

    if (!existingTeacher) {
      return NextResponse.json(
        { error: "강사를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    await prisma.teacher.delete({
      where: { id }
    });

    return NextResponse.json({ message: "강사가 삭제되었습니다." });
  } catch (error) {
    console.error("강사 삭제 오류:", error);
    return NextResponse.json(
      { error: "강사 삭제 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
} 