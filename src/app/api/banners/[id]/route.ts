import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET 요청 처리 - 특정 배너 가져오기
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const paramValues = await params;
    const id = paramValues.id;

    const banner = await prisma.banner.findUnique({
      where: { id }
    });

    if (!banner) {
      return NextResponse.json({ error: "배너를 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json(banner);
  } catch (error) {
    console.error("배너 조회 오류:", error);
    return NextResponse.json(
      { error: "배너 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// PATCH 요청 처리 - 배너 업데이트
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

    // 배너가 존재하는지 확인
    const existingBanner = await prisma.banner.findUnique({
      where: { id }
    });

    if (!existingBanner) {
      return NextResponse.json(
        { error: "배너를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const updatedBanner = await prisma.banner.update({
      where: { id },
      data
    });

    return NextResponse.json(updatedBanner);
  } catch (error) {
    console.error("배너 업데이트 오류:", error);
    return NextResponse.json(
      { error: "배너 업데이트 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// DELETE 요청 처리 - 배너 삭제
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

    // 배너가 존재하는지 확인
    const existingBanner = await prisma.banner.findUnique({
      where: { id }
    });

    if (!existingBanner) {
      return NextResponse.json(
        { error: "배너를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    await prisma.banner.delete({
      where: { id }
    });

    return NextResponse.json({ message: "배너가 삭제되었습니다." });
  } catch (error) {
    console.error("배너 삭제 오류:", error);
    return NextResponse.json(
      { error: "배너 삭제 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
