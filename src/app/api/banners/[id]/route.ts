import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET 요청 처리 - 특정 배너 가져오기
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const banner = await prisma.banner.findUnique({
      where: { id },
    });

    if (!banner) {
      return NextResponse.json(
        { error: "배너를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json(banner);
  } catch (error) {
    console.error("배너를 가져오는데 실패했습니다:", error);
    return NextResponse.json(
      { error: "배너를 가져오는데 실패했습니다." },
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
    const { id } = params;
    const data = await request.json();

    // 배너 존재 여부 확인
    const existingBanner = await prisma.banner.findUnique({
      where: { id },
    });

    if (!existingBanner) {
      return NextResponse.json(
        { error: "배너를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 배너 업데이트
    const updatedBanner = await prisma.banner.update({
      where: { id },
      data,
    });

    return NextResponse.json(updatedBanner);
  } catch (error) {
    console.error("배너 업데이트에 실패했습니다:", error);
    return NextResponse.json(
      { error: "배너 업데이트에 실패했습니다." },
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
    const { id } = params;

    // 배너 존재 여부 확인
    const existingBanner = await prisma.banner.findUnique({
      where: { id },
    });

    if (!existingBanner) {
      return NextResponse.json(
        { error: "배너를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 배너 삭제
    await prisma.banner.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("배너 삭제에 실패했습니다:", error);
    return NextResponse.json(
      { error: "배너 삭제에 실패했습니다." },
      { status: 500 }
    );
  }
}
