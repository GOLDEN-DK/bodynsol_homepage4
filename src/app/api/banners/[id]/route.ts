import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET 요청 처리 - 특정 배너 가져오기
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const banner = await prisma.banner.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!banner) {
      return NextResponse.json(
        { error: "배너를 찾을 수 없습니다." },
        { status: 404 }
      );
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
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();

    // order 값이 문자열인 경우 정수로 변환
    if (data.order !== undefined) {
      data.order =
        typeof data.order === "string" ? parseInt(data.order, 10) : data.order;
    }

    const banner = await prisma.banner.update({
      where: {
        id: params.id,
      },
      data,
    });

    return NextResponse.json(banner);
  } catch (error) {
    console.error("배너 수정 오류:", error);
    return NextResponse.json(
      { error: "배너 수정 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// DELETE 요청 처리 - 배너 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.banner.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("배너 삭제 오류:", error);
    return NextResponse.json(
      { error: "배너 삭제 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
