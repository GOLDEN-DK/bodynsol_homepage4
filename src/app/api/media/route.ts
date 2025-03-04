import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // 세션 확인 (인증된 관리자만 접근 가능)
    const session = await getServerSession();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: '인증되지 않은 접근입니다.' },
        { status: 401 }
      );
    }

    // 미디어 목록 조회
    const mediaList = await prisma.media.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(mediaList);
  } catch (error) {
    console.error('미디어 목록 조회 오류:', error);
    return NextResponse.json(
      { error: '미디어 목록을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 