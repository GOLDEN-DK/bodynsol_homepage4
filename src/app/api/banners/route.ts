import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET 요청 처리 - 배너 목록 가져오기
export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: {
        order: "asc",
      },
    });

    return NextResponse.json(banners);
  } catch (error) {
    console.error("배너 목록을 가져오는데 실패했습니다:", error);
    return NextResponse.json(
      { error: "배너 목록을 가져오는데 실패했습니다." },
      { status: 500 }
    );
  }
}

// POST 요청 처리 - 새 배너 추가
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // 필수 필드 검증
    if (!data.title || !data.imageUrl) {
      return NextResponse.json(
        { error: "제목과 이미지 URL은 필수 항목입니다." },
        { status: 400 }
      );
    }

    // 배너 생성
    const banner = await prisma.banner.create({
      data: {
        title: data.title,
        description: data.description || null,
        imageUrl: data.imageUrl,
        imageWidth: data.imageWidth || 0,
        imageHeight: data.imageHeight || 0,
        link: data.link || null,
        isActive: data.isActive !== undefined ? data.isActive : true,
        order: data.order || 0,
        mediaType: data.mediaType || "image", // 'image', 'gif', 'video' 중 하나
      },
    });

    return NextResponse.json(banner);
  } catch (error) {
    console.error("배너 추가에 실패했습니다:", error);
    return NextResponse.json(
      { error: "배너 추가에 실패했습니다." },
      { status: 500 }
    );
  }
}
